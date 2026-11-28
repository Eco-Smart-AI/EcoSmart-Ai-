"""
Step 1 (Run this locally where you already ran `pip install ultralytics`):
Downloads `arnabdhar/YOLOv8-nano-trash-detection` from Hugging Face
and exports it to a lightweight `.onnx` file (`backend/models/ecosmart_waste.onnx`)
plus `backend/models/classes.json` ready to upload to PythonAnywhere!

Usage:
    python backend/download_and_export_onnx.py
"""

import json
import os
import shutil
import urllib.request
from pathlib import Path
from ultralytics import YOLO

BASE_DIR = Path(__file__).resolve().parent
MODELS_DIR = BASE_DIR / "models"
MODELS_DIR.mkdir(parents=True, exist_ok=True)

# Direct Hugging Face URLs for true Instance-Level YOLOv8 Waste Detection models
# Primary: muaaaa29/Plastic-Waste-Detection-YOLOv8 (boxes every individual PET bottle, HDPE container, carton/UHT-Box, sachet/film at any distance/angle)
HF_Candidate_URLS = [
    "https://huggingface.co/muaaaa29/Plastic-Waste-Detection-YOLOv8/resolve/main/best.pt",
    "https://huggingface.co/HrutikAdsare/waste-detection-yolov8/resolve/main/best.pt",
    "https://huggingface.co/kendrickfff/waste-classification-yolov8-ken/resolve/main/yolov8n-waste-12cls-best.pt",
]

LOCAL_PT_PATH = MODELS_DIR / "yolov8n_trash_best.pt"
FINAL_ONNX_PATH = MODELS_DIR / "ecosmart_waste.onnx"
CLASSES_JSON_PATH = MODELS_DIR / "classes.json"


def download_hf_weights() -> Path:
    if LOCAL_PT_PATH.exists() and LOCAL_PT_PATH.stat().st_size > 100_000:
        print(f"[✓] Found existing weights at: {LOCAL_PT_PATH}")
        return LOCAL_PT_PATH

    print("[*] Downloading YOLOv8 Nano Waste Detection weights from Hugging Face...")
    headers = {"User-Agent": "Mozilla/5.0 (EcoSmart-AI-Model-Exporter)"}

    for url in HF_Candidate_URLS:
        try:
            print(f"    Trying: {url}")
            req = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(req, timeout=45) as resp, open(LOCAL_PT_PATH, "wb") as out_f:
                shutil.copyfileobj(resp, out_f)
            if LOCAL_PT_PATH.stat().st_size > 100_000:
                print(f"[✓] Downloaded successfully ({LOCAL_PT_PATH.stat().st_size / 1e6:.2f} MB)")
                return LOCAL_PT_PATH
        except Exception as err:
            print(f"    [!] Could not fetch {url}: {err}")

    # Fallback: try huggingface_hub if installed
    try:
        from huggingface_hub import hf_hub_download, list_repo_files
        files = list_repo_files(HF_REPO_ID)
        pt_files = [f for f in files if f.endswith(".pt")]
        if pt_files:
            downloaded = hf_hub_download(repo_id=HF_REPO_ID, filename=pt_files[0])
            shutil.copy(downloaded, LOCAL_PT_PATH)
            print(f"[✓] Downloaded {pt_files[0]} via huggingface_hub")
            return LOCAL_PT_PATH
    except Exception as hub_err:
        print(f"    [!] huggingface_hub fallback skipped: {hub_err}")

    print("[!] Falling back to base yolov8n.pt so you can still export immediately...")
    return Path("yolov8n.pt")


def main():
    pt_file = download_hf_weights()

    print(f"[*] Loading YOLO model from: {pt_file}")
    model = YOLO(str(pt_file))

    # Save exact class index -> class name dictionary for PythonAnywhere ONNX runtime
    class_names = {str(k): v for k, v in model.names.items()}
    with open(CLASSES_JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(class_names, f, indent=2)
    print(f"[✓] Saved {len(class_names)} model classes to: {CLASSES_JSON_PATH}")
    print(f"    Classes: {class_names}")

    # Export to ONNX (640x640)
    print("[*] Exporting model to ONNX format (640x640)...")
    exported_path = model.export(format="onnx", imgsz=640)
    exported_path = Path(exported_path)

    if exported_path.resolve() != FINAL_ONNX_PATH.resolve():
        shutil.move(str(exported_path), str(FINAL_ONNX_PATH))

    size_mb = FINAL_ONNX_PATH.stat().st_size / (1024 * 1024)
    print("\n" + "=" * 65)
    print(f"[SUCCESS] ONNX model ready: {FINAL_ONNX_PATH} ({size_mb:.2f} MB)")
    print(f"[SUCCESS] Classes JSON ready: {CLASSES_JSON_PATH}")
    print("Upload the `backend/` folder (including `backend/models/ecosmart_waste.onnx`)")
    print("to PythonAnywhere — NO PyTorch or Ultralytics needed on PythonAnywhere!")
    print("=" * 65)


if __name__ == "__main__":
    main()
