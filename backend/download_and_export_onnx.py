"""
Downloads and exports the paired YOLOv8 ONNX models for EcoSmart AI:
  1. `models/ecosmart_waste.onnx` (`muaaaa29/Plastic-Waste-Detection-YOLOv8`):
     Multi-instance detector that boxes and counts individual bottles, HDPE containers,
     nylons/sachets, and UHT drink cartons at any scale/angle.
  2. `models/ecosmart_material.onnx` (`HrutikAdsare/waste-detection-yolov8`):
     Multi-material verifier (`metal`/cans, `cardboard`, `glass`, `paper`, `plastic`, `e-waste`)
     that runs sequentially to detect Aluminium Cans, Glass, and Cardboard and prevent
     aluminium cans from being misclassified as plastic bottles.

Usage:
    python backend/download_and_export_onnx.py
"""

import json
import shutil
import urllib.request
from pathlib import Path
from ultralytics import YOLO

BASE_DIR = Path(__file__).resolve().parent
MODELS_DIR = BASE_DIR / "models"
MODELS_DIR.mkdir(parents=True, exist_ok=True)

MODELS_TO_EXPORT = [
    {
        "name": "Instance Detector (muaaaa29/Plastic-Waste-Detection-YOLOv8)",
        "url": "https://huggingface.co/muaaaa29/Plastic-Waste-Detection-YOLOv8/resolve/main/best.pt",
        "pt_path": MODELS_DIR / "instance_detector.pt",
        "onnx_path": MODELS_DIR / "ecosmart_waste.onnx",
        "classes_path": MODELS_DIR / "classes.json",
    },
    {
        "name": "Material & Can Verifier (HrutikAdsare/waste-detection-yolov8)",
        "url": "https://huggingface.co/HrutikAdsare/waste-detection-yolov8/resolve/main/best.pt",
        "pt_path": MODELS_DIR / "material_verifier.pt",
        "onnx_path": MODELS_DIR / "ecosmart_material.onnx",
        "classes_path": MODELS_DIR / "material_classes.json",
    },
]


def download_file(url: str, dest: Path) -> None:
    if dest.exists() and dest.stat().st_size > 100_000:
        print(f"[✓] Using cached weights: {dest.name}")
        return
    print(f"[*] Downloading {url} -> {dest.name} ...")
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (EcoSmart-AI)"})
    with urllib.request.urlopen(req, timeout=60) as resp, open(dest, "wb") as out_f:
        shutil.copyfileobj(resp, out_f)
    print(f"[✓] Downloaded {dest.name} ({dest.stat().st_size / 1e6:.2f} MB)")


def export_one(cfg: dict) -> None:
    pt_path: Path = cfg["pt_path"]
    onnx_path: Path = cfg["onnx_path"]
    classes_path: Path = cfg["classes_path"]

    download_file(cfg["url"], pt_path)

    model = YOLO(str(pt_path))
    class_map = {str(k): v for k, v in model.names.items()}
    with open(classes_path, "w", encoding="utf-8") as f:
        json.dump(class_map, f, indent=2)
    print(f"[✓] {cfg['name']} classes: {class_map}")

    if not onnx_path.exists():
        print(f"[*] Exporting {pt_path.name} -> {onnx_path.name} ...")
        exported = Path(model.export(format="onnx", imgsz=640))
        if exported.resolve() != onnx_path.resolve():
            shutil.move(str(exported), str(onnx_path))

    # Clean up temporary .pt file to save disk space
    if pt_path.exists():
        pt_path.unlink()


def main():
    tmp_bench = MODELS_DIR / "tmp_bench" / "hrutik_waste.pt"
    if tmp_bench.exists() and not (MODELS_DIR / "material_verifier.pt").exists():
        shutil.move(str(tmp_bench), str(MODELS_DIR / "material_verifier.pt"))
    shutil.rmtree(MODELS_DIR / "tmp_bench", ignore_errors=True)

    for cfg in MODELS_TO_EXPORT:
        export_one(cfg)

    print("\n" + "=" * 65)
    print("[SUCCESS] Both paired ONNX models are ready in backend/models/:")
    for cfg in MODELS_TO_EXPORT:
        mb = cfg["onnx_path"].stat().st_size / (1024 * 1024)
        print(f"  - {cfg['onnx_path'].name} ({mb:.2f} MB)")
    print("=" * 65)


if __name__ == "__main__":
    main()
