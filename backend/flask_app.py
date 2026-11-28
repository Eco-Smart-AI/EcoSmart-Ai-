"""
EcoSmart AI — Hardened PythonAnywhere Flask + Paired ONNX Runtime Backend
=========================================================================
Implements all 8 production computer-vision & PythonAnywhere hardening rules:
  1. Aspect-Ratio Letterbox Preprocessing (`ImageOps.exif_transpose` + `(114,114,114)` pad)
     and coordinate mapping back to the original un-squashed image dimensions.
  2. Per-Class Non-Maximum Suppression (`offset = class_ids[:, None] * 4096`, capped at 100).
  3. Embedded ONNX Metadata Class Reading (`session.get_modelmeta().custom_metadata_map["names"]`)
     + Explicit `CLASS_TO_BUCKET` dictionary (no fragile substring guessing).
  4. Sequential Paired Models:
       - Model A (`ecosmart_waste.onnx` — `muaaaa29/Plastic-Waste-Detection-YOLOv8`):
         Counts individual bottles, HDPE containers, sachets/films, and UHT cartons.
       - Model B (`ecosmart_material.onnx` — `HrutikAdsare/waste-detection-yolov8`):
         Detects `metal` (Aluminium cans), `cardboard`, `paper`, `glass`, and overrides
         Model A when cylindrical Aluminium Cans are mistaken for plastic bottles.
  5. Honest Empty Results: Never fabricates detections when a real photo has 0 detections
     (only explicit `is_simulation: true` requests run the math simulator).
  6. Multi-Material Mixed Valuation: Values every material bucket present in a photo
     (e.g., 10 bottles + 6 cans together) and outputs weight ranges (`0.85x–1.15x`).
  7. Hardened Image Intake (`MAX_CONTENT_LENGTH = 8 MB`, `MAX_IMAGE_PIXELS = 40M`, `img.draft`,
     and HTTP 400 on corrupt uploads).
  8. Selective Training Vault Saving: Only saves to `training_vault/` when the user confirms
     or corrects a label in `/api/scan/custom-label` (with `uuid4()` filenames, un-squashed
     aspect ratio up to 1280px, and normalized YOLO `.txt` label files `class cx cy w h`),
     plus `/api/scan/verify-scale-weight` to record recyclers' physical scale weights.
"""

import os

# CRITICAL FOR PYTHONANYWHERE: Lock OpenMP / NumPy / ONNX threads to 1 before importing numpy
os.environ["OMP_NUM_THREADS"] = "1"
os.environ["OPENBLAS_NUM_THREADS"] = "1"
os.environ["MKL_NUM_THREADS"] = "1"
os.environ["VECLIB_MAXIMUM_THREADS"] = "1"
os.environ["NUMEXPR_NUM_THREADS"] = "1"

import ast
import base64
import io
import json
import sqlite3
import time
import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

import numpy as np
from flask import Flask, jsonify, render_template, request
from flask_cors import CORS
from PIL import Image, ImageOps, UnidentifiedImageError

try:
    import onnxruntime as ort
except ImportError:
    ort = None

BASE_DIR = Path(__file__).resolve().parent
MODELS_DIR = BASE_DIR / "models"
VAULT_DIR = BASE_DIR / "training_vault"
DB_PATH = BASE_DIR / "ecosmart.db"

MODELS_DIR.mkdir(parents=True, exist_ok=True)
VAULT_DIR.mkdir(parents=True, exist_ok=True)

INSTANCE_ONNX_PATH = MODELS_DIR / "ecosmart_waste.onnx"
INSTANCE_CLASSES_PATH = MODELS_DIR / "classes.json"

MATERIAL_ONNX_PATH = MODELS_DIR / "ecosmart_material.onnx"
MATERIAL_CLASSES_PATH = MODELS_DIR / "material_classes.json"

# Hardened image intake limits for PythonAnywhere RAM protection
Image.MAX_IMAGE_PIXELS = 40_000_000

app = Flask(__name__)
app.config["MAX_CONTENT_LENGTH"] = 8 * 1024 * 1024  # Reject uploads > 8 MB
CORS(app)

# ============================================================================
# 1. NIGERIAN WASTE BUCKETS & EXPLICIT CLASS-TO-BUCKET DICTIONARY
# ============================================================================
BUCKET_INDEX_FOR_YOLO_TXT = {
    "pet": 0,
    "hdpe": 1,
    "cans": 2,
    "carton": 3,
    "glass": 4,
    "sachet": 5,
}

NIGERIAN_MATERIAL_BUCKETS: Dict[str, Dict[str, Any]] = {
    "pet": {
        "id": "pet",
        "name": "Clear PET Plastic Bottles",
        "local_examples": "Eva, Coke, Pepsi, Bigi, Cway water & soda bottles",
        "unit_name_singular": "bottle",
        "unit_name_plural": "bottles",
        "avg_unit_weight_kg": 0.020,  # 20g per standard bottle
        "units_per_1kg": 50,         # 50 bottles = 1 kg
        "default_rate_naira": 120,
        "min_rate_naira": 80,
        "max_rate_naira": 150,
    },
    "hdpe": {
        "id": "hdpe",
        "name": "Hard HD Plastic (HDPE)",
        "local_examples": "Hypo jugs, detergent containers, rub, bottle caps",
        "unit_name_singular": "container",
        "unit_name_plural": "containers",
        "avg_unit_weight_kg": 0.060,  # 60g per container
        "units_per_1kg": 17,         # ~17 containers = 1 kg
        "default_rate_naira": 105,
        "min_rate_naira": 90,
        "max_rate_naira": 140,
    },
    "cans": {
        "id": "cans",
        "name": "Aluminium Cans & Metal",
        "local_examples": "Maltina, Amstel, Coke, Fearless, Predator cans (Gongon)",
        "unit_name_singular": "can",
        "unit_name_plural": "cans",
        "avg_unit_weight_kg": 0.015,  # 15g per 33cl can
        "units_per_1kg": 67,         # ~67 cans = 1 kg
        "default_rate_naira": 600,
        "min_rate_naira": 500,
        "max_rate_naira": 800,
    },
    "carton": {
        "id": "carton",
        "name": "Cardboard & Paper Cartons",
        "local_examples": "Indomie cartons, brown boxes, UHT juice/milk cartons, office paper",
        "unit_name_singular": "carton",
        "unit_name_plural": "cartons",
        "avg_unit_weight_kg": 0.125,  # 125g per medium carton
        "units_per_1kg": 8,          # ~8 cartons = 1 kg
        "default_rate_naira": 60,
        "min_rate_naira": 40,
        "max_rate_naira": 80,
    },
    "glass": {
        "id": "glass",
        "name": "Glass Bottles & Jars",
        "local_examples": "Beverage glass bottles, jars",
        "unit_name_singular": "glass bottle",
        "unit_name_plural": "glass bottles",
        "avg_unit_weight_kg": 0.250,  # 250g per glass bottle
        "units_per_1kg": 4,          # 4 glass bottles = 1 kg
        "default_rate_naira": 30,
        "min_rate_naira": 20,
        "max_rate_naira": 40,
    },
    "sachet": {
        "id": "sachet",
        "name": "Pure Water Sachets / Nylon (LDPE)",
        "local_examples": "Pure water leather, sachet bags, packaging film & wrappers",
        "unit_name_singular": "sachet",
        "unit_name_plural": "sachets",
        "avg_unit_weight_kg": 0.003,  # 3g per empty sachet/wrapper
        "units_per_1kg": 333,        # ~333 sachets = 1 kg
        "default_rate_naira": 50,
        "min_rate_naira": 30,
        "max_rate_naira": 70,
    },
}

# Explicit class dictionary — NO fragile substring matching, NO silent fallback to "pet"
CLASS_TO_BUCKET: Dict[str, Optional[str]] = {
    # Model A: muaaaa29/Plastic-Waste-Detection-YOLOv8 (7 classes)
    "pet bottle": "pet",
    "hdpe plastic": "hdpe",
    "single-layer plastic": "sachet",
    "multi-layer plastic": "sachet",
    "single-use-plastic": "sachet",
    "squeeze-tube": "sachet",
    "uht-box": "carton",
    # Model B: HrutikAdsare/waste-detection-yolov8 & TrashNet/TACO classes
    "metal": "cans",
    "can": "cans",
    "aluminium": "cans",
    "cardboard": "carton",
    "carton": "carton",
    "paper": "carton",
    "glass": "glass",
    "glass bottle": "glass",
    "brown-glass": "glass",
    "green-glass": "glass",
    "white-glass": "glass",
    "plastic": "pet",
    "plasticbottle": "pet",
    "bottle": "pet",
    "bottle cap": "hdpe",
    "cup": "hdpe",
    "other plastic": "hdpe",
    "plastic bag & wrapper": "sachet",
    # Non-recyclable or uncollected classes explicitly mapped to None (ignored in payout)
    "aluminium foil": None,
    "broken glass": None,
    "e-waste": None,
    "battery": None,
    "medical": None,
    "organic": None,
    "biological": None,
    "clothes": None,
    "shoes": None,
    "trash": None,
}


def map_yolo_class_to_bucket(raw_label: str) -> Optional[str]:
    """Explicit lookup: returns bucket_id or None if unknown/uncollected."""
    return CLASS_TO_BUCKET.get(raw_label.strip().lower(), None)


# ============================================================================
# 2. SQLITE DATABASE (MARKET RATES, NIGERIAN ALIAS LOOKUP, TRAINING VAULT)
# ============================================================================
def now_utc_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def init_db():
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()

    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS market_rates (
            bucket_id TEXT PRIMARY KEY,
            min_rate INTEGER,
            max_rate INTEGER,
            avg_rate INTEGER,
            updated_at TEXT
        )
        """
    )
    for b_id, info in NIGERIAN_MATERIAL_BUCKETS.items():
        cur.execute(
            """
            INSERT OR IGNORE INTO market_rates (bucket_id, min_rate, max_rate, avg_rate, updated_at)
            VALUES (?, ?, ?, ?, ?)
            """,
            (
                b_id,
                info["min_rate_naira"],
                info["max_rate_naira"],
                info["default_rate_naira"],
                now_utc_iso(),
            ),
        )

    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS nigerian_material_aliases (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            custom_name TEXT UNIQUE,
            bucket_id TEXT,
            usage_count INTEGER DEFAULT 1,
            created_at TEXT
        )
        """
    )

    starter_aliases = [
        ("Pure water nylon", "sachet", 14),
        ("Pure water leather", "sachet", 9),
        ("Eva rubber", "pet", 19),
        ("La Casera bottle", "pet", 11),
        ("Hypo gallon", "hdpe", 8),
        ("Maltina pan", "cans", 12),
        ("Gongon", "cans", 7),
        ("Indomie carton", "carton", 15),
    ]
    for cname, bid, cnt in starter_aliases:
        cur.execute(
            """
            INSERT OR IGNORE INTO nigerian_material_aliases (custom_name, bucket_id, usage_count, created_at)
            VALUES (?, ?, ?, ?)
            """,
            (cname, bid, cnt, now_utc_iso()),
        )

    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS training_vault_samples (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            sample_uuid TEXT UNIQUE,
            image_filename TEXT,
            yolo_txt_filename TEXT,
            yolo_raw_detections TEXT,
            user_custom_name TEXT,
            bucket_id TEXT,
            estimated_count INTEGER,
            estimated_weight_kg REAL,
            verified_scale_weight_kg REAL,
            user_consent INTEGER DEFAULT 1,
            created_at TEXT
        )
        """
    )
    conn.commit()
    conn.close()


init_db()


# ============================================================================
# 3.PAIRED ONNX MODEL LOADERS (READS EMBEDDED METADATA NAMES DIRECTLY)
# ============================================================================
INSTANCE_SESSION = None
INSTANCE_CLASSES: Dict[str, str] = {}

MATERIAL_SESSION = None
MATERIAL_CLASSES: Dict[str, str] = {}


def extract_onnx_class_names(session: Any, fallback_json_path: Path) -> Dict[str, str]:
    """Reads Ultralytics class names directly from the ONNX file's custom_metadata_map."""
    try:
        meta = session.get_modelmeta().custom_metadata_map
        if "names" in meta:
            parsed = ast.literal_eval(meta["names"])
            if isinstance(parsed, dict):
                return {str(k): str(v) for k, v in parsed.items()}
    except Exception as err:
        print(f"[!] Could not parse embedded ONNX metadata names: {err}")

    if fallback_json_path.exists():
        try:
            with open(fallback_json_path, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            pass
    return {}


def create_single_thread_session(onnx_path: Path) -> Any:
    sess_options = ort.SessionOptions()
    sess_options.intra_op_num_threads = 1
    sess_options.inter_op_num_threads = 1
    sess_options.graph_optimization_level = ort.GraphOptimizationLevel.ORT_ENABLE_BASIC
    return ort.InferenceSession(
        str(onnx_path),
        sess_options=sess_options,
        providers=["CPUExecutionProvider"],
    )


def load_paired_onnx_models():
    global INSTANCE_SESSION, INSTANCE_CLASSES, MATERIAL_SESSION, MATERIAL_CLASSES
    if ort is None:
        print("[!] onnxruntime not installed.")
        return

    if INSTANCE_ONNX_PATH.exists():
        INSTANCE_SESSION = create_single_thread_session(INSTANCE_ONNX_PATH)
        INSTANCE_CLASSES = extract_onnx_class_names(INSTANCE_SESSION, INSTANCE_CLASSES_PATH)
        print(f"[✓] Loaded Model A (Instance Detector): {INSTANCE_ONNX_PATH.name} -> {INSTANCE_CLASSES}")

    if MATERIAL_ONNX_PATH.exists():
        MATERIAL_SESSION = create_single_thread_session(MATERIAL_ONNX_PATH)
        MATERIAL_CLASSES = extract_onnx_class_names(MATERIAL_SESSION, MATERIAL_CLASSES_PATH)
        print(f"[✓] Loaded Model B (Material/Can Verifier): {MATERIAL_ONNX_PATH.name} -> {MATERIAL_CLASSES}")


load_paired_onnx_models()


# ============================================================================
# 4. LETTERBOX PREPROCESSING + PER-CLASS NMS + SEQUENTIAL PAIRED INFERENCE
# ============================================================================
def load_image_safely(fileobj: Any) -> Image.Image:
    """Hardened image loader: fixes EXIF orientation and limits decoding memory."""
    img = Image.open(fileobj)
    try:
        img.draft("RGB", (1280, 1280))
    except Exception:
        pass
    img = ImageOps.exif_transpose(img).convert("RGB")
    return img


def preprocess_image_letterbox(
    pil_img: Image.Image, size: int = 640
) -> Tuple[np.ndarray, Dict[str, float], Image.Image]:
    """
    Preserves aspect ratio using YOLO standard (114, 114, 114) letterbox padding
    instead of squashing the image. Returns input tensor, letterbox metadata, and RGB image.
    """
    img = ImageOps.exif_transpose(pil_img).convert("RGB")
    w, h = img.size
    r = min(size / w, size / h)
    nw, nh = round(w * r), round(h * r)
    px, py = (size - nw) // 2, (size - nh) // 2

    canvas = Image.new("RGB", (size, size), (114, 114, 114))
    canvas.paste(img.resize((nw, nh), Image.Resampling.BILINEAR), (px, py))

    arr = np.asarray(canvas, dtype=np.float32) / 255.0
    arr = arr.transpose(2, 0, 1)[None]  # [1, 3, 640, 640]
    meta = {"r": r, "px": px, "py": py, "orig_w": w, "orig_h": h, "size": size}
    return arr, meta, img


def numpy_nms(boxes: np.ndarray, scores: np.ndarray, iou_threshold: float = 0.45) -> List[int]:
    """Pure NumPy Non-Maximum Suppression."""
    if len(boxes) == 0:
        return []
    x1 = boxes[:, 0]
    y1 = boxes[:, 1]
    x2 = boxes[:, 2]
    y2 = boxes[:, 3]
    areas = np.maximum(0.0, x2 - x1) * np.maximum(0.0, y2 - y1)
    order = scores.argsort()[::-1]

    keep: List[int] = []
    while order.size > 0:
        i = int(order[0])
        keep.append(i)
        if order.size == 1:
            break
        xx1 = np.maximum(x1[i], x1[order[1:]])
        yy1 = np.maximum(y1[i], y1[order[1:]])
        xx2 = np.minimum(x2[i], x2[order[1:]])
        yy2 = np.minimum(y2[i], y2[order[1:]])

        w = np.maximum(0.0, xx2 - xx1)
        h = np.maximum(0.0, yy2 - yy1)
        inter = w * h
        iou = inter / (areas[i] + areas[order[1:]] - inter + 1e-6)
        inds = np.where(iou <= iou_threshold)[0]
        order = order[inds + 1]
    return keep


def run_single_session(
    session: Any,
    class_map: Dict[str, str],
    input_tensor: np.ndarray,
    meta: Dict[str, float],
    conf_thres: float = 0.25,
    source_tag: str = "instance",
) -> List[Dict[str, Any]]:
    """
    Runs one ONNX session with per-class NMS (`offset = class_ids[:, None] * 4096`),
    caps at 100 detections, and maps coordinates back to original image dimensions.
    """
    if session is None:
        return []

    input_name = session.get_inputs()[0].name
    outputs = session.run(None, {input_name: input_tensor})

    preds = np.squeeze(outputs[0])
    if preds.shape[0] < preds.shape[1]:
        preds = preds.T  # [8400, 4 + num_classes]

    boxes_xywh = preds[:, :4]
    class_scores = preds[:, 4:]
    class_ids = np.argmax(class_scores, axis=1)
    max_scores = np.max(class_scores, axis=1)

    mask = max_scores >= conf_thres
    boxes_xywh = boxes_xywh[mask]
    max_scores = max_scores[mask]
    class_ids = class_ids[mask]

    if len(boxes_xywh) == 0:
        return []

    boxes_xyxy = np.zeros_like(boxes_xywh)
    boxes_xyxy[:, 0] = boxes_xywh[:, 0] - boxes_xywh[:, 2] / 2
    boxes_xyxy[:, 1] = boxes_xywh[:, 1] - boxes_xywh[:, 3] / 2
    boxes_xyxy[:, 2] = boxes_xywh[:, 0] + boxes_xywh[:, 2] / 2
    boxes_xyxy[:, 3] = boxes_xywh[:, 1] + boxes_xywh[:, 3] / 2

    # Per-class NMS so e.g. a cap on a bottle does not suppress the bottle
    offset = class_ids[:, None] * 4096.0
    keep_indices = numpy_nms(boxes_xyxy + offset, max_scores, iou_threshold=0.45)[:100]

    orig_w, orig_h = meta["orig_w"], meta["orig_h"]
    px, py, r = meta["px"], meta["py"], meta["r"]

    detections: List[Dict[str, Any]] = []
    for idx in keep_indices:
        cid = str(int(class_ids[idx]))
        raw_name = class_map.get(cid, f"class_{cid}")
        bucket_id = map_yolo_class_to_bucket(raw_name)

        # Skip uncollected / non-recyclable classes (None)
        if bucket_id is None:
            continue

        lx1, ly1, lx2, ly2 = boxes_xyxy[idx].tolist()

        # Map from 640x640 letterbox back to original image pixels
        ox1 = float(np.clip((lx1 - px) / r, 0, orig_w))
        oy1 = float(np.clip((ly1 - py) / r, 0, orig_h))
        ox2 = float(np.clip((lx2 - px) / r, 0, orig_w))
        oy2 = float(np.clip((ly2 - py) / r, 0, orig_h))

        # Normalized YOLO format [cx, cy, w, h] in 0..1 relative to original image
        bw = max(1.0, ox2 - ox1)
        bh = max(1.0, oy2 - oy1)
        norm_cx = round((ox1 + bw / 2.0) / orig_w, 5)
        norm_cy = round((oy1 + bh / 2.0) / orig_h, 5)
        norm_w = round(bw / orig_w, 5)
        norm_h = round(bh / orig_h, 5)

        detections.append(
            {
                "class_id": int(class_ids[idx]),
                "raw_class_name": raw_name,
                "bucket_id": bucket_id,
                "confidence": round(float(max_scores[idx]), 3),
                "box_orig": [round(ox1, 1), round(oy1, 1), round(ox2, 1), round(oy2, 1)],
                "box_640": [round(lx1, 1), round(ly1, 1), round(lx2, 1), round(ly2, 1)],
                "yolo_norm": [
                    BUCKET_INDEX_FOR_YOLO_TXT.get(bucket_id, 0),
                    norm_cx,
                    norm_cy,
                    norm_w,
                    norm_h,
                ],
                "model_source": source_tag,
            }
        )
    return detections


def box_iou_1d(box_a: List[float], box_b: List[float]) -> float:
    x1 = max(box_a[0], box_b[0])
    y1 = max(box_a[1], box_b[1])
    x2 = min(box_a[2], box_b[2])
    y2 = min(box_a[3], box_b[3])
    inter = max(0.0, x2 - x1) * max(0.0, y2 - y1)
    area_a = max(1.0, (box_a[2] - box_a[0]) * (box_a[3] - box_a[1]))
    area_b = max(1.0, (box_b[2] - box_b[0]) * (box_b[3] - box_b[1]))
    return inter / min(area_a, area_b)


def run_paired_yolo_pipeline(
    pil_img: Image.Image, conf_thres: float = 0.22
) -> Tuple[List[Dict[str, Any]], Dict[str, float], Image.Image]:
    """
    Sequential Paired Pipeline:
      1. Runs Model A (`INSTANCE_SESSION` — `muaaaa29/Plastic-Waste-Detection-YOLOv8`) to detect
         and count individual items (`PET Bottle`, `HDPE Plastic`, `UHT-Box`, `Single-Use-Plastic`).
      2. Runs Model B (`MATERIAL_SESSION` — `HrutikAdsare/waste-detection-yolov8`) sequentially
         to check for non-plastic materials (`metal`/cans, `cardboard`, `paper`, `glass`):
         - Because Model A has ZERO metal/can or glass classes in its training set, it boxes
           individual Aluminium Cans or Glass Bottles accurately by shape, but mislabels them
           as `Single-Use-Plastic`, `PET Bottle`, or `UHT-Box`.
         - Whenever Model B detects `metal` (`cans`) or `glass` (with higher confidence than
           Model B's `plastic` class), every individual box from Model A overlapping that region
           is re-labeled to `Aluminium Can` (`cans`) or `Glass Bottle` (`glass`) while keeping
           Model A's individual item boxes and count!
    """
    if (INSTANCE_SESSION is None and INSTANCE_ONNX_PATH.exists()) or (
        MATERIAL_SESSION is None and MATERIAL_ONNX_PATH.exists()
    ):
        load_paired_onnx_models()

    input_tensor, meta, img_rgb = preprocess_image_letterbox(pil_img, size=640)

    dets_a = run_single_session(
        INSTANCE_SESSION,
        INSTANCE_CLASSES,
        input_tensor,
        meta,
        conf_thres=conf_thres,
        source_tag="instance_detector",
    )

    dets_b = run_single_session(
        MATERIAL_SESSION,
        MATERIAL_CLASSES,
        input_tensor,
        meta,
        conf_thres=0.10,
        source_tag="material_verifier",
    )

    if not dets_a:
        return [d for d in dets_b if d["confidence"] >= 0.25], meta, img_rgb

    if dets_b:
        max_plastic_b = max(
            (d["confidence"] for d in dets_b if d["bucket_id"] == "pet"), default=0.0
        )
        max_metal_b = max(
            (d["confidence"] for d in dets_b if d["bucket_id"] == "cans"), default=0.0
        )
        max_glass_b = max(
            (d["confidence"] for d in dets_b if d["bucket_id"] == "glass"), default=0.0
        )
        metal_boxes_b = [
            d for d in dets_b if d["bucket_id"] == "cans" and d["confidence"] >= 0.45
        ]
        glass_boxes_b = [
            d for d in dets_b if d["bucket_id"] == "glass" and d["confidence"] >= 0.50
        ]

        # Pairing rules between Model A (Instance Detector) and Model B (Material Verifier):
        #   1. True PET bottles (upright, crushed, or piled) have PET ribbing/necks that Model A
        #      recognizes specifically as `PET Bottle` with high confidence (>= 0.80). Protect these
        #      so Model B's glass false-positives on clear plastic never override `PET Bottle`.
        #   2. Smooth glass bottles lack PET ribbing, so Model A mislabels them as `HDPE Plastic`
        #      (or `Single-Use-Plastic`), while Model B strongly detects `glass` (>= 0.55).
        #      (Real HDPE jugs are opaque, so Model B never classifies real HDPE as high-conf `glass`.)
        #   3. Aluminium cans are mislabeled by Model A as `Single-Use-Plastic` or `UHT-Box`,
        #      while Model B strongly detects `metal` (`cans`, >= 0.55).
        scene_is_metal_cans = max_metal_b >= 0.55 and max_metal_b > (max_plastic_b + 0.20)
        scene_is_glass = max_glass_b >= 0.55 and max_glass_b > (max_plastic_b + 0.20)

        for da in dets_a:
            is_high_conf_pet = (
                da["raw_class_name"] == "PET Bottle" and da["confidence"] >= 0.80
            )
            if is_high_conf_pet:
                continue

            if scene_is_metal_cans and max_metal_b >= max_glass_b:
                da["bucket_id"] = "cans"
                da["raw_class_name"] = "Aluminium Can"
                da["yolo_norm"][0] = BUCKET_INDEX_FOR_YOLO_TXT["cans"]
                da["model_source"] = "paired_instance+can_verifier"
                continue

            if scene_is_glass and max_glass_b > max_metal_b:
                da["bucket_id"] = "glass"
                da["raw_class_name"] = "Glass Bottle"
                da["yolo_norm"][0] = BUCKET_INDEX_FOR_YOLO_TXT["glass"]
                da["model_source"] = "paired_instance+glass_verifier"
                continue

            overridden = False
            for db in metal_boxes_b:
                overlap = box_iou_1d(da["box_640"], db["box_640"])
                if overlap > 0.25 and db["confidence"] >= max(0.50, max_plastic_b + 0.15):
                    da["bucket_id"] = "cans"
                    da["raw_class_name"] = "Aluminium Can"
                    da["yolo_norm"][0] = BUCKET_INDEX_FOR_YOLO_TXT["cans"]
                    da["model_source"] = "paired_instance+can_verifier"
                    overridden = True
                    break

            if not overridden:
                for db in glass_boxes_b:
                    overlap = box_iou_1d(da["box_640"], db["box_640"])
                    if overlap > 0.25 and db["confidence"] >= max(0.55, max_plastic_b + 0.15):
                        da["bucket_id"] = "glass"
                        da["raw_class_name"] = "Glass Bottle"
                        da["yolo_norm"][0] = BUCKET_INDEX_FOR_YOLO_TXT["glass"]
                        da["model_source"] = "paired_instance+glass_verifier"
                        break

    return dets_a, meta, img_rgb


# ============================================================================
# 5. MULTI-MATERIAL VALUATION ENGINE (VALUES EVERY BUCKET + WEIGHT RANGES)
# ============================================================================
def get_live_rate_for_bucket(bucket_id: str) -> Dict[str, int]:
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    cur.execute(
        "SELECT min_rate, max_rate, avg_rate FROM market_rates WHERE bucket_id = ?",
        (bucket_id,),
    )
    row = cur.fetchone()
    conn.close()
    info = NIGERIAN_MATERIAL_BUCKETS.get(bucket_id, NIGERIAN_MATERIAL_BUCKETS["pet"])
    if row:
        return {"min_rate": row[0], "max_rate": row[1], "avg_rate": row[2]}
    return {
        "min_rate": info["min_rate_naira"],
        "max_rate": info["max_rate_naira"],
        "avg_rate": info["default_rate_naira"],
    }


def calculate_waste_valuation(bucket_id: str, item_count: int) -> Dict[str, Any]:
    """Calculates weight, weight range (0.85x-1.15x), 1kg progress, and Naira valuation for one bucket."""
    bucket = NIGERIAN_MATERIAL_BUCKETS.get(bucket_id, NIGERIAN_MATERIAL_BUCKETS["pet"])
    rates = get_live_rate_for_bucket(bucket_id)

    count = max(0, int(item_count))
    unit_weight_kg = bucket["avg_unit_weight_kg"]
    units_per_1kg = bucket["units_per_1kg"]

    estimated_weight_kg = round(count * unit_weight_kg, 3)
    weight_min_kg = round(estimated_weight_kg * 0.85, 2)
    weight_max_kg = round(estimated_weight_kg * 1.15, 2)

    rate_per_kg = rates["avg_rate"]
    estimated_naira = round(estimated_weight_kg * rate_per_kg)

    units_needed_for_1kg = max(0, units_per_1kg - count)
    units_for_3kg_pickup = units_per_1kg * 3
    units_needed_for_3kg = max(0, units_for_3kg_pickup - count)

    unit_word = bucket["unit_name_singular"] if count == 1 else bucket["unit_name_plural"]
    plural_word = bucket["unit_name_plural"]

    if count == 0:
        guidance_message = "No recyclable items counted yet."
    elif count < units_per_1kg:
        guidance_message = (
            f"Detected {count} {unit_word} (about {weight_min_kg}–{weight_max_kg} kg ≈ ₦{estimated_naira}). "
            f"Roughly {units_per_1kg} {plural_word} make 1 kg (₦{rate_per_kg}). "
            f"Add ~{units_needed_for_1kg} more {plural_word} to reach 1 kg, or "
            f"~{units_needed_for_3kg} more to reach the 3 kg home pickup minimum!"
        )
    else:
        guidance_message = (
            f"Detected {count} {unit_word} (about {weight_min_kg}–{weight_max_kg} kg). "
            f"Since ~{units_per_1kg} {plural_word} = 1 kg (₦{rate_per_kg}/kg), "
            f"your estimated payout is ₦{estimated_naira}."
        )

    return {
        "bucket_id": bucket_id,
        "material_name": bucket["name"],
        "local_examples": bucket["local_examples"],
        "detected_count": count,
        "unit_label": plural_word,
        "unit_weight_grams": round(unit_weight_kg * 1000, 1),
        "units_per_1kg": units_per_1kg,
        "units_needed_for_1kg": units_needed_for_1kg,
        "units_needed_for_3kg_pickup": units_needed_for_3kg,
        "estimated_weight_kg": estimated_weight_kg,
        "estimated_weight_range_kg": [weight_min_kg, weight_max_kg],
        "rate_per_kg_naira": rate_per_kg,
        "min_rate_per_kg_naira": rates["min_rate"],
        "max_rate_per_kg_naira": rates["max_rate"],
        "estimated_payout_naira": estimated_naira,
        "price_for_1kg_naira": rate_per_kg,
        "guidance_message": guidance_message,
    }


def calculate_multi_bucket_valuation(detections: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Values EVERY material bucket detected in the photo (e.g. 8 PET bottles + 4 cans together)
    and aggregates total_kg and total_naira.
    """
    bucket_counts: Dict[str, int] = {}
    for d in detections:
        b = d.get("bucket_id")
        if b in NIGERIAN_MATERIAL_BUCKETS:
            bucket_counts[b] = bucket_counts.get(b, 0) + 1

    items_breakdown = [
        calculate_waste_valuation(b, cnt) for b, cnt in bucket_counts.items()
    ]
    total_kg = round(sum(v["estimated_weight_kg"] for v in items_breakdown), 3)
    total_naira = sum(v["estimated_payout_naira"] for v in items_breakdown)
    total_count = sum(v["detected_count"] for v in items_breakdown)

    dominant_bucket = max(bucket_counts, key=bucket_counts.get)
    primary_val = calculate_waste_valuation(dominant_bucket, bucket_counts[dominant_bucket])

    # Enrich primary valuation with multi-material totals when more than 1 material is present
    primary_val["items_breakdown"] = items_breakdown
    primary_val["total_combined_weight_kg"] = total_kg
    primary_val["total_combined_payout_naira"] = total_naira
    primary_val["total_combined_count"] = total_count
    primary_val["kg_needed_for_1kg_total"] = round(max(0.0, 1.0 - total_kg), 2)
    primary_val["kg_needed_for_3kg_pickup"] = round(max(0.0, 3.0 - total_kg), 2)

    if len(items_breakdown) > 1:
        summary_parts = [
            f"{v['detected_count']} {v['unit_label']} ({v['material_name']} · ₦{v['estimated_payout_naira']})"
            for v in items_breakdown
        ]
        primary_val["guidance_message"] = (
            f"Mixed load detected: {' + '.join(summary_parts)}. "
            f"Combined weight: ~{round(total_kg * 0.85, 2)}–{round(total_kg * 1.15, 2)} kg "
            f"(Total est. value: ₦{total_naira})."
        )

    return primary_val


# ============================================================================
# 6. REST API ENDPOINTS & STANDALONE HTML/JS DEMO APP
# ============================================================================
@app.route("/", methods=["GET"])
def demo_home():
    """Serves the standalone Python + HTML + JS YOLOv8 Waste Vision & 1kg Price Demo UI."""
    return render_template("demo.html")


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify(
        {
            "status": "ok",
            "instance_model": "muaaaa29/Plastic-Waste-Detection-YOLOv8",
            "instance_onnx_loaded": INSTANCE_SESSION is not None,
            "instance_classes": INSTANCE_CLASSES,
            "material_model": "HrutikAdsare/waste-detection-yolov8",
            "material_onnx_loaded": MATERIAL_SESSION is not None,
            "material_classes": MATERIAL_CLASSES,
            "onnx_loaded": INSTANCE_SESSION is not None,
            "model_repo": "Paired: muaaaa29 (Instance) + HrutikAdsare (Cans/Glass/Carton)",
            "classes_count": len(INSTANCE_CLASSES) + len(MATERIAL_CLASSES),
        }
    )


@app.route("/api/scan", methods=["POST"])
def scan_waste():
    """
    Hardened `/api/scan` endpoint:
      - Letterboxes uploaded images without squashing aspect ratio
      - Runs per-class NMS + sequential paired models (Plastic Instance Detector + Can/Material Verifier)
      - Returns an honest empty result (`valuation: None`) if 0 recyclables are detected in a photo
      - Values EVERY material bucket detected in mixed photos
      - Does NOT dump every random scan to disk (vault saves happen selectively in `/api/scan/custom-label`)
    """
    start_ts = time.time()
    req_json = request.get_json(silent=True) if request.is_json else {}
    req_json = req_json or {}

    # 1. Explicit Math Simulator Mode (only when user clicks a simulator button in UI)
    if req_json.get("is_simulation"):
        sim_bucket = req_json.get("fallback_bucket", "pet")
        sim_count = int(req_json.get("fallback_count", 2))
        val = calculate_waste_valuation(sim_bucket, sim_count)
        val["items_breakdown"] = [val.copy()]
        return jsonify(
            {
                "success": True,
                "is_simulation": True,
                "inference_time_ms": round((time.time() - start_ts) * 1000, 1),
                "onnx_active": INSTANCE_SESSION is not None,
                "detections": [],
                "valuation": val,
            }
        )

    # 2. Real Image Upload (Multipart or Base64 JSON)
    pil_img = None
    try:
        if "image" in request.files:
            pil_img = load_image_safely(request.files["image"].stream)
        elif req_json.get("image_base64"):
            b64_str = req_json["image_base64"]
            if "," in b64_str:
                b64_str = b64_str.split(",", 1)[1]
            img_bytes = base64.b64decode(b64_str)
            pil_img = load_image_safely(io.BytesIO(img_bytes))
        else:
            return jsonify({"success": False, "error": "No image provided."}), 400
    except (UnidentifiedImageError, ValueError, OSError) as img_err:
        return jsonify({"success": False, "error": f"Invalid or corrupt image: {img_err}"}), 400

    detections, meta, _ = run_paired_yolo_pipeline(pil_img, conf_thres=0.25)
    elapsed_ms = round((time.time() - start_ts) * 1000, 1)

    # 3. Honest Empty Result when nothing is detected (no fabricated "2 bottles, 88%")
    if not detections:
        return jsonify(
            {
                "success": True,
                "inference_time_ms": elapsed_ms,
                "onnx_active": INSTANCE_SESSION is not None,
                "image_size": {"width": meta["orig_w"], "height": meta["orig_h"]},
                "detections": [],
                "valuation": None,
                "items_breakdown": [],
                "message": "No recyclables detected. Try a closer, well-lit photo or enter items manually.",
            }
        )

    valuation = calculate_multi_bucket_valuation(detections)
    avg_conf = round(
        sum(d["confidence"] for d in detections) / len(detections), 2
    )

    return jsonify(
        {
            "success": True,
            "inference_time_ms": elapsed_ms,
            "onnx_active": INSTANCE_SESSION is not None,
            "confidence": avg_conf,
            "image_size": {"width": meta["orig_w"], "height": meta["orig_h"]},
            "detections": detections,
            "valuation": valuation,
            "items_breakdown": valuation.get("items_breakdown", []),
        }
    )


@app.route("/api/scan/custom-label", methods=["POST"])
def save_custom_nigerian_label():
    """
    Selective Training Vault & Alias Lookup endpoint:
      - Only saves images to `training_vault/` when the user explicitly confirms/submits here.
      - Uses `uuid4().hex` filenames (no timestamp collision risk).
      - Saves the un-squashed image (downscaled to max 1280px preserving aspect ratio).
      - Writes normalized YOLO annotations (`class cx cy w h`) to a matching `.txt` file
        so the vault is immediately ready for YOLOv8 fine-tuning on Colab.
    """
    data = request.get_json(silent=True) or {}
    custom_name = (data.get("custom_name") or "").strip()
    bucket_id = (data.get("bucket_id") or "pet").strip().lower()
    item_count = max(0, int(data.get("item_count") or 1))
    user_consent = bool(data.get("user_consent", True))
    detections = data.get("detections") or []
    b64_str = data.get("image_base64") or ""

    if bucket_id not in NIGERIAN_MATERIAL_BUCKETS:
        bucket_id = "pet"

    sample_uuid = uuid.uuid4().hex
    image_filename = ""
    yolo_txt_filename = ""

    # Save un-squashed image (max 1280px) + normalized YOLO .txt labels ONLY if user consented & sent image
    if user_consent and b64_str:
        try:
            if "," in b64_str:
                b64_str = b64_str.split(",", 1)[1]
            pil_img = load_image_safely(io.BytesIO(base64.b64decode(b64_str)))
            pil_img.thumbnail((1280, 1280), Image.Resampling.BILINEAR)
            image_filename = f"vault_{sample_uuid}.jpg"
            pil_img.save(VAULT_DIR / image_filename, format="JPEG", quality=82)

            # Write normalized YOLO .txt annotation file (class_id cx cy w h)
            yolo_txt_filename = f"vault_{sample_uuid}.txt"
            target_cls_idx = BUCKET_INDEX_FOR_YOLO_TXT.get(bucket_id, 0)
            yolo_lines = []
            for d in detections:
                yn = d.get("yolo_norm")
                if yn and len(yn) == 5:
                    yolo_lines.append(f"{target_cls_idx} {yn[1]} {yn[2]} {yn[3]} {yn[4]}")
            with open(VAULT_DIR / yolo_txt_filename, "w", encoding="utf-8") as tf:
                tf.write("\n".join(yolo_lines))
        except Exception as err:
            print(f"[!] Vault image save skipped: {err}")

    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()

    if custom_name:
        cur.execute(
            """
            INSERT INTO nigerian_material_aliases (custom_name, bucket_id, usage_count, created_at)
            VALUES (?, ?, 1, ?)
            ON CONFLICT(custom_name) DO UPDATE SET
                usage_count = usage_count + 1,
                bucket_id = excluded.bucket_id
            """,
            (custom_name, bucket_id, now_utc_iso()),
        )

    valuation = calculate_waste_valuation(bucket_id, item_count)
    valuation["items_breakdown"] = [valuation.copy()]

    cur.execute(
        """
        INSERT INTO training_vault_samples (
            sample_uuid, image_filename, yolo_txt_filename, yolo_raw_detections,
            user_custom_name, bucket_id, estimated_count, estimated_weight_kg,
            user_consent, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (
            sample_uuid,
            image_filename,
            yolo_txt_filename,
            json.dumps(detections),
            custom_name or valuation["material_name"],
            bucket_id,
            item_count,
            valuation["estimated_weight_kg"],
            1 if user_consent else 0,
            now_utc_iso(),
        ),
    )
    conn.commit()
    conn.close()

    if custom_name:
        valuation["custom_nigerian_name"] = custom_name

    return jsonify(
        {
            "success": True,
            "sample_uuid": sample_uuid,
            "saved_image": image_filename,
            "saved_yolo_txt": yolo_txt_filename,
            "learned_custom_name": custom_name,
            "valuation": valuation,
            "message": (
                f"Saved '{custom_name or valuation['material_name']}' to alias lookup & "
                f"YOLO training vault ({sample_uuid[:8]})."
            ),
        }
    )


@app.route("/api/scan/verify-scale-weight", methods=["POST"])
def verify_scale_weight():
    """
    When a recycler weighs the pickup on their calibrated physical scale, records
    `verified_scale_weight_kg` against the scan sample so EcoSmart can calibrate
    `avg_unit_weight_kg` against real-world scale weights.
    """
    data = request.get_json(silent=True) or {}
    sample_uuid = (data.get("sample_uuid") or "").strip()
    scale_kg = float(data.get("verified_scale_weight_kg") or 0.0)
    if not sample_uuid or scale_kg <= 0:
        return jsonify({"success": False, "error": "sample_uuid and verified_scale_weight_kg > 0 required"}), 400

    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    cur.execute(
        "UPDATE training_vault_samples SET verified_scale_weight_kg = ? WHERE sample_uuid = ?",
        (scale_kg, sample_uuid),
    )
    conn.commit()
    conn.close()
    return jsonify({"success": True, "sample_uuid": sample_uuid, "verified_scale_weight_kg": scale_kg})


@app.route("/api/scan/aliases", methods=["GET"])
def list_learned_aliases():
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    cur.execute(
        """
        SELECT custom_name, bucket_id, usage_count
        FROM nigerian_material_aliases
        ORDER BY usage_count DESC
        LIMIT 30
        """
    )
    rows = [
        {"custom_name": r[0], "bucket_id": r[1], "usage_count": r[2]}
        for r in cur.fetchall()
    ]
    conn.close()
    return jsonify({"aliases": rows})


@app.route("/api/market-rates", methods=["GET", "POST"])
def market_rates_api():
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()

    if request.method == "POST":
        data = request.get_json(silent=True) or {}
        b_id = data.get("bucket_id", "pet")
        min_r = int(data.get("min_rate", 80))
        max_r = int(data.get("max_rate", 150))
        avg_r = int(data.get("avg_rate", round((min_r + max_r) / 2)))
        cur.execute(
            """
            UPDATE market_rates
            SET min_rate = ?, max_rate = ?, avg_rate = ?, updated_at = ?
            WHERE bucket_id = ?
            """,
            (min_r, max_r, avg_r, now_utc_iso(), b_id),
        )
        conn.commit()

    cur.execute("SELECT bucket_id, min_rate, max_rate, avg_rate, updated_at FROM market_rates")
    rates = [
        {
            "bucket_id": r[0],
            "min_rate": r[1],
            "max_rate": r[2],
            "avg_rate": r[3],
            "updated_at": r[4],
        }
        for r in cur.fetchall()
    ]
    conn.close()
    return jsonify({"rates": rates})


if __name__ == "__main__":
    dev_debug = os.environ.get("FLASK_DEBUG", "1") == "1"
    app.run(host="0.0.0.0", port=5000, debug=dev_debug)
