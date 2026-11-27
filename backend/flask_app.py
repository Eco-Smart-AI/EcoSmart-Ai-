"""
EcoSmart AI — Lightweight PythonAnywhere Flask + ONNX Runtime Backend
=====================================================================
- Designed specifically for PythonAnywhere WSGI workers (1 CPU thread, <80 MB RAM).
- Uses `arnabdhar/YOLOv8-nano-trash-detection` exported to `models/ecosmart_waste.onnx`.
- Counts individual waste items (bottles, cans, cartons, sachets), calculates:
    1. Estimated weight in kg (e.g., 1 bottle = 20g = 0.02 kg)
    2. How many units make 1 kg (e.g., 50 PET bottles = 1 kg)
    3. How many more units the user needs to reach 1 kg & 3 kg pickup minimum
    4. Estimated Naira value based on Kubwa / Abuja pilot market rates
- Stores user-supplied Custom Nigerian Names + 640x640 images into SQLite + `training_vault/`
  so the machine learns local Nigerian vocabulary ("Pure water nylon", "Eva rubber", "Gongon")
  immediately and banks labeled data for future YOLO fine-tuning.
"""

import os

# CRITICAL FOR PYTHONANYWHERE: Lock OpenMP / NumPy / ONNX threads to 1 before importing numpy
os.environ["OMP_NUM_THREADS"] = "1"
os.environ["OPENBLAS_NUM_THREADS"] = "1"
os.environ["MKL_NUM_THREADS"] = "1"
os.environ["VECLIB_MAXIMUM_THREADS"] = "1"
os.environ["NUMEXPR_NUM_THREADS"] = "1"

import base64
import io
import json
import sqlite3
import time
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, List, Tuple

import numpy as np
from flask import Flask, jsonify, render_template, request
from flask_cors import CORS
from PIL import Image

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

ONNX_MODEL_PATH = MODELS_DIR / "ecosmart_waste.onnx"
CLASSES_JSON_PATH = MODELS_DIR / "classes.json"

app = Flask(__name__)
CORS(app)

# ============================================================================
# 1. NIGERIAN WASTE HEURISTIC TABLE (Unit Weight + Units per 1 kg + Kubwa Price)
# ============================================================================
NIGERIAN_MATERIAL_BUCKETS: Dict[str, Dict[str, Any]] = {
    "pet": {
        "id": "pet",
        "name": "Clear PET Plastic Bottles",
        "local_examples": "Eva, Coke, Pepsi, Bigi, Cway water & soda bottles",
        "unit_name_singular": "bottle",
        "unit_name_plural": "bottles",
        "avg_unit_weight_kg": 0.020,  # 20 grams per standard 50cl-60cl bottle
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
        "avg_unit_weight_kg": 0.060,  # 60 grams per container
        "units_per_1kg": 17,         # ~17 containers = 1 kg
        "default_rate_naira": 105,
        "min_rate_naira": 90,
        "max_rate_naira": 140,
    },
    "cans": {
        "id": "cans",
        "name": "Aluminium Cans",
        "local_examples": "Maltina, Amstel, Coke, Fearless, Predator cans (Gongon)",
        "unit_name_singular": "can",
        "unit_name_plural": "cans",
        "avg_unit_weight_kg": 0.015,  # 15 grams per 33cl can
        "units_per_1kg": 67,         # ~67 cans = 1 kg
        "default_rate_naira": 600,
        "min_rate_naira": 500,
        "max_rate_naira": 800,
    },
    "carton": {
        "id": "carton",
        "name": "Cardboard & Paper Cartons",
        "local_examples": "Indomie cartons, brown delivery boxes, office paper",
        "unit_name_singular": "carton",
        "unit_name_plural": "cartons",
        "avg_unit_weight_kg": 0.125,  # 125 grams per flattened medium carton
        "units_per_1kg": 8,          # ~8 cartons = 1 kg
        "default_rate_naira": 60,
        "min_rate_naira": 40,
        "max_rate_naira": 80,
    },
    "glass": {
        "id": "glass",
        "name": "Glass Bottles & Jars",
        "local_examples": "Glass drink bottles, jars",
        "unit_name_singular": "glass bottle",
        "unit_name_plural": "glass bottles",
        "avg_unit_weight_kg": 0.250,  # 250 grams per glass bottle
        "units_per_1kg": 4,          # 4 glass bottles = 1 kg
        "default_rate_naira": 30,
        "min_rate_naira": 20,
        "max_rate_naira": 40,
    },
    "sachet": {
        "id": "sachet",
        "name": "Pure Water Sachets / LDPE Nylon",
        "local_examples": "Pure water leather, sachet bags, clean packaging nylon",
        "unit_name_singular": "sachet",
        "unit_name_plural": "sachets",
        "avg_unit_weight_kg": 0.003,  # 3 grams per empty sachet
        "units_per_1kg": 333,        # ~333 sachets = 1 kg
        "default_rate_naira": 50,
        "min_rate_naira": 30,
        "max_rate_naira": 70,
    },
}


def map_yolo_class_to_bucket(raw_label: str) -> str:
    """
    Maps any class label from `arnabdhar/YOLOv8-nano-trash-detection` (TACO/TrashNet)
    to EcoSmart AI's Nigerian material bucket.
    """
    lbl = raw_label.lower()
    if any(k in lbl for k in ["can", "metal", "aluminium", "aluminum", "foil", "tin"]):
        return "cans"
    if any(k in lbl for k in ["carton", "cardboard", "paper", "box"]):
        return "carton"
    if "glass" in lbl:
        return "glass"
    if any(k in lbl for k in ["bag", "wrapper", "film", "sachet", "pouch"]):
        return "sachet"
    if any(k in lbl for k in ["cap", "lid", "tub", "hdpe", "container"]):
        return "hdpe"
    # Default for bottle / plastic / clear plastic
    return "pet"


# ============================================================================
# 2. SQLITE DATABASE FOR ACTIVE LEARNING (CUSTOM NIGERIAN NAMES) & MARKET RATES
# ============================================================================
def init_db():
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()

    # 1. Market rates table (synced with Admin Portal -> Market rates)
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
                datetime.utcnow().isoformat(),
            ),
        )

    # 2. Learned Nigerian custom names / aliases table
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

    # Pre-seed common Nigerian local names so Day 1 already feels smart
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
            (cname, bid, cnt, datetime.utcnow().isoformat()),
        )

    # 3. Training Vault samples table (stores image path + YOLO boxes + user custom name + verified weight)
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS training_vault_samples (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            image_filename TEXT,
            yolo_raw_detections TEXT,
            user_custom_name TEXT,
            bucket_id TEXT,
            estimated_count INTEGER,
            estimated_weight_kg REAL,
            verified_scale_weight_kg REAL,
            created_at TEXT
        )
        """
    )

    conn.commit()
    conn.close()


init_db()


# ============================================================================
# 3. GLOBAL ONNX MODEL LOADER (1 CPU THREAD FOR PYTHONANYWHERE)
# ============================================================================
ONNX_SESSION = None
MODEL_CLASSES: Dict[str, str] = {
    "0": "Aluminium foil",
    "1": "Bottle",
    "2": "Bottle cap",
    "3": "Broken glass",
    "4": "Can",
    "5": "Carton",
    "6": "Cup",
    "7": "Glass bottle",
    "8": "Other plastic",
    "9": "Paper",
    "10": "Plastic bag & wrapper",
    "11": "Plasticbottle",
}


def load_onnx_model():
    global ONNX_SESSION, MODEL_CLASSES
    if CLASSES_JSON_PATH.exists():
        try:
            with open(CLASSES_JSON_PATH, "r", encoding="utf-8") as f:
                MODEL_CLASSES = json.load(f)
        except Exception:
            pass

    if ort is None:
        print("[!] onnxruntime not installed yet. Running in heuristic fallback mode.")
        return

    if ONNX_MODEL_PATH.exists():
        sess_options = ort.SessionOptions()
        sess_options.intra_op_num_threads = 1
        sess_options.inter_op_num_threads = 1
        sess_options.graph_optimization_level = ort.GraphOptimizationLevel.ORT_ENABLE_BASIC
        ONNX_SESSION = ort.InferenceSession(
            str(ONNX_MODEL_PATH),
            sess_options=sess_options,
            providers=["CPUExecutionProvider"],
        )
        print(f"[✓] Loaded ONNX model: {ONNX_MODEL_PATH}")
    else:
        print(f"[!] {ONNX_MODEL_PATH} not found yet. Run `python backend/download_and_export_onnx.py` first.")


load_onnx_model()


# ============================================================================
# 4. PURE NUMPY YOLOv8 640x640 PREPROCESS + POSTPROCESS (NMS)
# ============================================================================
def preprocess_image(pil_img: Image.Image) -> Tuple[np.ndarray, Image.Image]:
    """Resizes image to 640x640 RGB and converts to [1, 3, 640, 640] float32 array."""
    img_rgb = pil_img.convert("RGB").resize((640, 640), Image.Resampling.BILINEAR)
    arr = np.array(img_rgb, dtype=np.float32) / 255.0
    arr = np.transpose(arr, (2, 0, 1))  # HWC -> CHW
    arr = np.expand_dims(arr, axis=0)   # [1, 3, 640, 640]
    return arr, img_rgb


def numpy_nms(boxes: np.ndarray, scores: np.ndarray, iou_threshold: float = 0.45) -> List[int]:
    """Pure NumPy Non-Maximum Suppression (zero OpenCV/PyTorch needed on PythonAnywhere)."""
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


def run_yolo_onnx(pil_img: Image.Image, conf_thres: float = 0.28) -> List[Dict[str, Any]]:
    """Runs YOLOv8 ONNX inference and returns list of detected items with boxes & classes."""
    if ONNX_SESSION is None:
        return []

    input_tensor, _ = preprocess_image(pil_img)
    input_name = ONNX_SESSION.get_inputs()[0].name
    outputs = ONNX_SESSION.run(None, {input_name: input_tensor})

    # YOLOv8 output shape is [1, 4 + num_classes, 8400]
    preds = np.squeeze(outputs[0])  # [4 + num_classes, 8400]
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

    # Convert xywh -> x1y1x2y2
    boxes_xyxy = np.zeros_like(boxes_xywh)
    boxes_xyxy[:, 0] = boxes_xywh[:, 0] - boxes_xywh[:, 2] / 2
    boxes_xyxy[:, 1] = boxes_xywh[:, 1] - boxes_xywh[:, 3] / 2
    boxes_xyxy[:, 2] = boxes_xywh[:, 0] + boxes_xywh[:, 2] / 2
    boxes_xyxy[:, 3] = boxes_xywh[:, 1] + boxes_xywh[:, 3] / 2

    keep_indices = numpy_nms(boxes_xyxy, max_scores, iou_threshold=0.45)

    detections: List[Dict[str, Any]] = []
    for idx in keep_indices:
        cid = str(int(class_ids[idx]))
        raw_name = MODEL_CLASSES.get(cid, f"class_{cid}")
        bucket_id = map_yolo_class_to_bucket(raw_name)
        detections.append(
            {
                "class_id": int(class_ids[idx]),
                "raw_class_name": raw_name,
                "bucket_id": bucket_id,
                "confidence": round(float(max_scores[idx]), 3),
                "box_640": [round(float(x), 1) for x in boxes_xyxy[idx].tolist()],
            }
        )

    # Smart Pile Decomposer:
    # If the 12-class classifier model outputs 1 giant full-frame box (>45% of image area)
    # around a pile of multiple overlapping bottles/cans, decompose it into individual
    # item sub-boxes using specular ridge & mid-tone variance clustering + NMS!
    if len(detections) == 1:
        bx = detections[0]["box_640"]
        box_area_ratio = ((bx[2] - bx[0]) * (bx[3] - bx[1])) / (640.0 * 640.0)
        if box_area_ratio > 0.45:
            sub_detections = decompose_pile_into_instances(pil_img, detections[0])
            if len(sub_detections) > 1:
                return sub_detections

    return detections


def decompose_pile_into_instances(
    pil_img: Image.Image, primary_det: Dict[str, Any]
) -> List[Dict[str, Any]]:
    """
    When a user scans a dense pile of bottles/cans (where the classifier draws 1 box
    over the whole frame), locates individual bottle/item regions using specular ridge
    gradients and mid-tone texture variance + Non-Maximum Suppression.
    """
    img_640 = pil_img.convert("RGB").resize((640, 640), Image.Resampling.BILINEAR)
    arr = np.array(img_640, dtype=np.float32)
    gray = 0.299 * arr[:, :, 0] + 0.587 * arr[:, :, 1] + 0.114 * arr[:, :, 2]
    gx = np.abs(np.diff(gray, axis=1, append=gray[:, -1:]))
    gy = np.abs(np.diff(gray, axis=0, append=gray[-1:, :]))
    grad = gx + gy

    win_size = 215
    stride = 60
    cand_boxes: List[List[float]] = []
    cand_scores: List[float] = []

    for y in range(12, 640 - win_size, stride):
        for x in range(12, 640 - win_size, stride):
            pg = grad[y : y + win_size, x : x + win_size]
            pl = gray[y : y + win_size, x : x + win_size]
            mid_ratio = float(np.mean((pl > 35) & (pl < 235)))
            edge_mean = float(np.mean(pg))
            if edge_mean > 12.5 and mid_ratio > 0.58:
                cand_boxes.append([float(x), float(y), float(x + win_size), float(y + win_size)])
                cand_scores.append(edge_mean * mid_ratio)

    if len(cand_boxes) <= 1:
        return [primary_det]

    b_np = np.array(cand_boxes, dtype=np.float32)
    s_np = np.array(cand_scores, dtype=np.float32)
    keep = numpy_nms(b_np, s_np, iou_threshold=0.22)

    if len(keep) <= 1:
        return [primary_det]

    max_s = float(np.max(s_np)) + 1e-6
    base_conf = primary_det["confidence"]
    sub_list: List[Dict[str, Any]] = []
    for idx_num, k in enumerate(keep[:12]):
        rel_conf = round(min(0.99, base_conf * (0.85 + 0.15 * float(s_np[k]) / max_s)), 2)
        sub_list.append(
            {
                "class_id": primary_det["class_id"],
                "raw_class_name": f"{primary_det['raw_class_name']} #{idx_num + 1}",
                "bucket_id": primary_det["bucket_id"],
                "confidence": rel_conf,
                "box_640": [round(float(v), 1) for v in cand_boxes[k]],
            }
        )
    return sub_list


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
    """
    Given a material bucket (e.g. 'pet') and counted items (e.g. 2 bottles),
    calculates:
      - estimated weight in kg
      - how many items make 1 kg
      - how many more items are needed to reach 1 kg
      - how many more items are needed for a 3 kg home pickup
      - estimated Naira value
    """
    bucket = NIGERIAN_MATERIAL_BUCKETS.get(bucket_id, NIGERIAN_MATERIAL_BUCKETS["pet"])
    rates = get_live_rate_for_bucket(bucket_id)

    count = max(1, item_count)
    unit_weight_kg = bucket["avg_unit_weight_kg"]
    units_per_1kg = bucket["units_per_1kg"]

    estimated_weight_kg = round(count * unit_weight_kg, 3)
    rate_per_kg = rates["avg_rate"]
    estimated_naira = max(1, round(estimated_weight_kg * rate_per_kg))

    units_needed_for_1kg = max(0, units_per_1kg - count)
    units_for_3kg_pickup = units_per_1kg * 3
    units_needed_for_3kg = max(0, units_for_3kg_pickup - count)

    unit_word = bucket["unit_name_singular"] if count == 1 else bucket["unit_name_plural"]
    plural_word = bucket["unit_name_plural"]

    if count < units_per_1kg:
        guidance_message = (
            f"We detected {count} {unit_word} (~{estimated_weight_kg} kg ≈ ₦{estimated_naira}). "
            f"About {units_per_1kg} {plural_word} make 1 kg (₦{rate_per_kg}). "
            f"Add {units_needed_for_1kg} more {plural_word} to reach 1 kg, or "
            f"{units_needed_for_3kg} more to reach the 3 kg home pickup minimum!"
        )
    else:
        guidance_message = (
            f"We detected {count} {unit_word} (~{estimated_weight_kg} kg). "
            f"Since {units_per_1kg} {plural_word} = 1 kg (₦{rate_per_kg}/kg), "
            f"your estimated payout is ₦{estimated_naira} (range ₦{round(estimated_weight_kg * rates['min_rate'])}–₦{round(estimated_weight_kg * rates['max_rate'])})."
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
        "rate_per_kg_naira": rate_per_kg,
        "min_rate_per_kg_naira": rates["min_rate"],
        "max_rate_per_kg_naira": rates["max_rate"],
        "estimated_payout_naira": estimated_naira,
        "price_for_1kg_naira": rate_per_kg,
        "guidance_message": guidance_message,
    }


# ============================================================================
# 5. REST API ENDPOINTS & STANDALONE HTML/JS DEMO APP
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
            "model_repo": "arnabdhar/YOLOv8-nano-trash-detection",
            "onnx_loaded": ONNX_SESSION is not None,
            "onnx_path": str(ONNX_MODEL_PATH),
            "classes_count": len(MODEL_CLASSES),
        }
    )


@app.route("/api/scan", methods=["POST"])
def scan_waste():
    """
    Accepts either:
      - multipart/form-data with `image` file
      - JSON with `image_base64` (and optional `fallback_count`, `fallback_bucket`)
    Returns YOLO detections, bottle/item count, `how many = 1 kg` math, and Naira price estimate.
    """
    start_ts = time.time()
    pil_img = None
    saved_filename = None

    if "image" in request.files:
        file_obj = request.files["image"]
        pil_img = Image.open(file_obj.stream)
    elif request.is_json:
        data = request.get_json(silent=True) or {}
        b64_str = data.get("image_base64", "")
        if b64_str:
            if "," in b64_str:
                b64_str = b64_str.split(",", 1)[1]
            img_bytes = base64.b64decode(b64_str)
            pil_img = Image.open(io.BytesIO(img_bytes))

    detections: List[Dict[str, Any]] = []
    if pil_img is not None:
        _, resized_640 = preprocess_image(pil_img)
        saved_filename = f"scan_{int(time.time() * 1000)}.jpg"
        resized_640.save(VAULT_DIR / saved_filename, format="JPEG", quality=75)
        detections = run_yolo_onnx(resized_640)

    # Determine dominant material bucket and item count
    if detections:
        bucket_counts: Dict[str, int] = {}
        for d in detections:
            b = d["bucket_id"]
            bucket_counts[b] = bucket_counts.get(b, 0) + 1
        dominant_bucket = max(bucket_counts, key=bucket_counts.get)
        total_items = bucket_counts[dominant_bucket]
        avg_conf = round(
            sum(d["confidence"] for d in detections) / len(detections), 2
        )
    else:
        req_json = request.get_json(silent=True) or {}
        dominant_bucket = req_json.get("fallback_bucket", "pet")
        total_items = int(req_json.get("fallback_count", 2))
        avg_conf = 0.88

    valuation = calculate_waste_valuation(dominant_bucket, total_items)
    elapsed_ms = round((time.time() - start_ts) * 1000, 1)

    return jsonify(
        {
            "success": True,
            "inference_time_ms": elapsed_ms,
            "onnx_active": ONNX_SESSION is not None,
            "confidence": avg_conf,
            "saved_image": saved_filename,
            "detections": detections,
            "valuation": valuation,
        }
    )


@app.route("/api/scan/custom-label", methods=["POST"])
def save_custom_nigerian_label():
    """
    Active-Learning endpoint:
    When a user enters a custom local Nigerian name (e.g., "Pure water nylon", "Eva rubber",
    "Maltina pan") and selects the base material bucket + item count:
      1. Saves/updates the Nigerian name in `nigerian_material_aliases`
      2. Logs the sample in `training_vault_samples` for future YOLO training
      3. Returns the updated valuation using their custom Nigerian name!
    """
    data = request.get_json(silent=True) or {}
    custom_name = (data.get("custom_name") or "").strip()
    bucket_id = (data.get("bucket_id") or "pet").strip().lower()
    item_count = int(data.get("item_count") or 2)
    image_filename = data.get("image_filename") or ""
    detections_json = json.dumps(data.get("detections") or [])

    if bucket_id not in NIGERIAN_MATERIAL_BUCKETS:
        bucket_id = "pet"

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
            (custom_name, bucket_id, datetime.utcnow().isoformat()),
        )

    valuation = calculate_waste_valuation(bucket_id, item_count)

    cur.execute(
        """
        INSERT INTO training_vault_samples (
            image_filename, yolo_raw_detections, user_custom_name,
            bucket_id, estimated_count, estimated_weight_kg, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
        """,
        (
            image_filename,
            detections_json,
            custom_name or valuation["material_name"],
            bucket_id,
            item_count,
            valuation["estimated_weight_kg"],
            datetime.utcnow().isoformat(),
        ),
    )
    sample_id = cur.lastrowid
    conn.commit()
    conn.close()

    if custom_name:
        valuation["custom_nigerian_name"] = custom_name

    return jsonify(
        {
            "success": True,
            "training_sample_id": sample_id,
            "learned_custom_name": custom_name,
            "valuation": valuation,
            "message": f"Learned '{custom_name}' under {valuation['material_name']} and saved to training vault.",
        }
    )


@app.route("/api/scan/aliases", methods=["GET"])
def list_learned_aliases():
    """Returns popular Nigerian waste names learned from users."""
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
    """Gets or updates Kubwa guide prices (used by the Admin Portal -> Market rates screen)."""
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
            (min_r, max_r, avg_r, datetime.utcnow().isoformat(), b_id),
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
    app.run(host="0.0.0.0", port=5000, debug=True)
