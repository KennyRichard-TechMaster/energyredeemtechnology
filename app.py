
from __future__ import annotations

import csv
from datetime import datetime
from pathlib import Path

from flask import Flask, jsonify, request, send_from_directory

BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"
DATA_DIR.mkdir(exist_ok=True)
CSV_FILE = DATA_DIR / "quote_requests.csv"

app = Flask(__name__, static_folder="assets")


def save_quote(data: dict[str, str]) -> None:
    fieldnames = ["timestamp", "name", "phone", "email", "project_type", "message"]
    file_exists = CSV_FILE.exists()

    with CSV_FILE.open("a", newline="", encoding="utf-8") as file:
        writer = csv.DictWriter(file, fieldnames=fieldnames)
        if not file_exists:
            writer.writeheader()
        writer.writerow(
            {
                "timestamp": datetime.now().isoformat(timespec="seconds"),
                "name": data.get("name", "").strip(),
                "phone": data.get("phone", "").strip(),
                "email": data.get("email", "").strip(),
                "project_type": data.get("project_type", "").strip(),
                "message": data.get("message", "").strip(),
            }
        )


@app.get("/")
def home():
    return send_from_directory(BASE_DIR, "index.html")


@app.get("/<path:page>")
def pages(page: str):
    if page.startswith("assets/"):
        return send_from_directory(BASE_DIR, page)
    return send_from_directory(BASE_DIR, page)


@app.post("/api/quote")
def quote():
    data = request.get_json(silent=True) or request.form.to_dict()
    required = ["name", "phone", "email", "project_type", "message"]
    missing = [key for key in required if not str(data.get(key, "")).strip()]

    if missing:
        return jsonify({"message": f"Please complete: {', '.join(missing)}."}), 400

    save_quote(data)
    return jsonify({"message": "Thank you. Your quote request has been received by Energy Redeemed Technology."})


if __name__ == "__main__":
    app.run(debug=True)
