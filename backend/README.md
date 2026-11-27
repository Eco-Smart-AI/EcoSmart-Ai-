# EcoSmart AI — PythonAnywhere Backend (`arnabdhar/YOLOv8-nano-trash-detection`)

## Step 1: Export the Pre-Trained Model to `.onnx` on Your Laptop

Since you already ran `pip install ultralytics`, run this single command on your PC:

```bash
pip install onnx
python backend/download_and_export_onnx.py
```

What this script does automatically:
1. Downloads **`arnabdhar/YOLOv8-nano-trash-detection`** from Hugging Face.
2. Extracts the model's exact class dictionary into **`backend/models/classes.json`**.
3. Exports the model to **`backend/models/ecosmart_waste.onnx`** (`~6–11 MB`).

---

## Step 2: Upload `backend/` to PythonAnywhere

1. Open your **PythonAnywhere** dashboard → **Files** tab.
2. Create a folder `/home/<yourusername>/ecosmart_backend` and upload:
   - `flask_app.py`
   - `requirements.txt`
   - `models/ecosmart_waste.onnx`
   - `models/classes.json`
3. Open a **PythonAnywhere Bash Console** and install the lightweight packages (notice **no PyTorch or Ultralytics** is needed on PythonAnywhere!):
   ```bash
   cd ~/ecosmart_backend
   pip install --user -r requirements.txt
   ```
4. Go to the **Web** tab on PythonAnywhere → open your **WSGI configuration file** → paste the contents of `backend/wsgi.py` (updating `yourusername`), and click **Reload**.

---

## Step 3: API Endpoints Available

| Endpoint | Method | What It Does |
| :--- | :---: | :--- |
| `/api/health` | `GET` | Confirms `ecosmart_waste.onnx` is loaded and active |
| `/api/scan` | `POST` | Runs YOLOv8 ONNX inference, counts items (e.g., 2 bottles), calculates `50 bottles = 1 kg (₦120)`, and returns Naira valuation |
| `/api/scan/custom-label` | `POST` | Saves user's **Custom Nigerian Name** (*"Pure water nylon"*, *"Eva rubber"*, *"Gongon"*) + image into SQLite & `training_vault/` |
| `/api/scan/aliases` | `GET` | Lists popular Nigerian waste names learned from users |
| `/api/market-rates` | `GET/POST` | Reads or updates Kubwa guide prices (`₦/kg`) from the Admin Portal |
