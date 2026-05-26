from datetime import datetime, timezone
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

MERCH = [
    {"id": 1, "name": "COTP Razor Tee", "price": "$38", "status": "Coming Soon"},
    {"id": 2, "name": "Chrome Logo Hoodie", "price": "$72", "status": "Coming Soon"},
    {"id": 3, "name": "Sharp Edge Poster", "price": "$22", "status": "Limited"},
]

MUSIC = [
    {"id": 1, "title": "Signal / Noise", "type": "Single", "year": "2026", "link": "#"},
    {"id": 2, "title": "Cold Frame", "type": "Demo", "year": "2026", "link": "#"},
    {"id": 3, "title": "Live Session 01", "type": "Video", "year": "2026", "link": "#"},
]

MESSAGES = []

@app.get("/api/health")
def health():
    return jsonify({"status": "ok", "service": "cotp-backend"})

@app.get("/api/merch")
def get_merch():
    return jsonify(MERCH)

@app.get("/api/music")
def get_music():
    return jsonify(MUSIC)

@app.post("/api/contact")
def contact():
    data = request.get_json(silent=True) or {}
    required = ["name", "email", "message"]
    missing = [field for field in required if not data.get(field)]
    if missing:
        return jsonify({"error": "Missing required fields", "missing": missing}), 400

    message = {
        "id": len(MESSAGES) + 1,
        "name": data["name"],
        "email": data["email"],
        "message": data["message"],
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    MESSAGES.append(message)
    return jsonify({"ok": True, "message": "Message received", "data": message}), 201

@app.get("/api/messages")
def get_messages():
    return jsonify(MESSAGES)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
