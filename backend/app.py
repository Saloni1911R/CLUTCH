import os
import json
import uuid
from flask import Flask, jsonify, request
from flask_cors import CORS
from google import genai
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": ["http://localhost:5173", "http://127.0.0.1:5173"]}})
app.config['SECRET_KEY'] = "clutch_secure_production_key_2026"

DB_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "clutch_database.json")

def init_db():
    if not os.path.exists(DB_FILE):
        with open(DB_FILE, "w") as f:
            json.dump({"users": {}, "tasks": []}, f, indent=4)
        print("📁 Initialized production schema JSON database file!")

def read_db():
    init_db()
    try:
        with open(DB_FILE, "r") as f:
            return json.load(f)
    except Exception:
        return {"users": {}, "tasks": []}

def write_db(data):
    with open(DB_FILE, "w") as f:
        json.dump(data, f, indent=4)

init_db()

# -------------------------------------------------------------
# 👤 AUTHENTICATION & PROFILE ENDPOINTS (Req #5, #6, #7, #8)
# -------------------------------------------------------------

@app.route('/api/auth/register', methods=['POST'])
def register():
    req = request.json or {}
    username = req.get('username', '').strip().lower()
    password = req.get('password', '')
    display_name = req.get('displayName', username)
    email = req.get('email', '')

    if not username or not password:
        return jsonify({"error": "Username and password required"}), 400

    data = read_db()
    if username in data["users"]:
        return jsonify({"error": "User signature already deployed"}), 400

    data["users"][username] = {
        "username": username,
        "password": password,  
        "displayName": display_name,
        "email": email,
        "avatarUrl": "https://api.dicebear.com/7.x/bottts/svg?seed=" + username,
        "timeZone": "GMT+5:30",
        "phone": "",
        "verified": False
    }
    write_db(data)
    return jsonify({"status": "success", "user": data["users"][username]}), 201


@app.route('/api/auth/login', methods=['POST'])
def login():
    req = request.json or {}
    username = req.get('username', '').strip().lower()
    password = req.get('password', '')

    data = read_db()
    user = data["users"].get(username)

    if not user or user["password"] != password:
        return jsonify({"error": "Invalid tactical access credentials"}), 401

    return jsonify({"status": "success", "user": user}), 200


@app.route('/api/user/profile', methods=['PUT'])
def update_profile():
    req = request.json or {}
    username = req.get('username', '').strip().lower()
    
    data = read_db()
    if username not in data["users"]:
        return jsonify({"error": "User context unavailable"}), 404

    user_node = data["users"][username]
    
    if 'displayName' in req: user_node['displayName'] = req['displayName']
    if 'password' in req and req['password']: user_node['password'] = req['password']
    if 'avatarUrl' in req: user_node['avatarUrl'] = req['avatarUrl']
    if 'timeZone' in req: user_node['timeZone'] = req['timeZone']
    if 'phone' in req: user_node['phone'] = req['phone']

    data["users"][username] = user_node
    write_db(data)
    return jsonify({"status": "success", "user": user_node}), 200


@app.route('/api/user/delete', methods=['DELETE'])
def delete_account():
    username = request.args.get('username', '').strip().lower()
    data = read_db()
    
    if username in data["users"]:
        del data["users"][username]
        data["tasks"] = [t for t in data["tasks"] if t.get("username") != username]
        write_db(data)
        return jsonify({"status": "success", "message": "Profile scrubbed from array"}), 200
    return jsonify({"error": "Profile not found"}), 404


# -------------------------------------------------------------
# 📅 CORE DYNAMIC TASK / HEATMAP ROUTING (Req #1, #2, #3, #4)
# -------------------------------------------------------------

@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    username = request.args.get('username', '').strip().lower()
    data = read_db()
    
    # ✅ Case-insensitive string tracking matrix correction applied here
    user_tasks = [
        task for task in data["tasks"] 
        if task.get("username", "").strip().lower() == username
    ]
    return jsonify(user_tasks), 200


@app.route('/api/tasks', methods=['POST'])
def add_task():
    task_payload = request.json or {}
    
    # ✅ Case-insensitive enforcement on incoming payload applied here
    if "username" in task_payload:
        task_payload["username"] = task_payload["username"].strip().lower()

    username = task_payload.get('username', '')
    
    if not username:
        return jsonify({"error": "Tasks must belong to an authenticated user context."}), 400

    data = read_db()
    
    task_payload["id"] = str(uuid.uuid4())
    if "status" not in task_payload:
        task_payload["status"] = "pending" 
    
    data["tasks"].append(task_payload)
    write_db(data)
    return jsonify({"status": "success", "task": task_payload}), 201


@app.route('/api/tasks/<task_id>', methods=['PUT'])
def update_task(task_id):
    updated_payload = request.json or {}
    data = read_db()
    
    task_found = False
    for idx, task in enumerate(data["tasks"]):
        if str(task.get("id")) == str(task_id):
            data["tasks"][idx].update(updated_payload)
            task_found = True
            break
            
    if not task_found:
        return jsonify({"error": "Target operational data node missing"}), 404
        
    write_db(data)
    return jsonify({"status": "success"}), 200


# --- GEMINI AI CLIENT BACKEND ENGINE ---
GEMINI_KEY = os.getenv("GEMINI_API_KEY")
try:
    if not GEMINI_KEY or GEMINI_KEY.startswith("AQ."):
        ai_client = None
    else:
        ai_client = genai.Client(api_key=GEMINI_KEY)
except Exception:
    ai_client = None

@app.route('/api/tasks/generate-preview', methods=['POST'])
def generate_preview():
    data = request.json or {}
    objective = data.get('objective', 'Urgent Deadline Task')
    workload = data.get('workload', 'Medium') 
    deadline = data.get('deadline', '24 Hours')
    user_message = data.get('user_message', '').strip().lower()

    if not ai_client:
        if 'break' in user_message or 'breack' in user_message or 'down' in user_message:
            reply = "📋 [Offline Engine] Here is your playbook playbook: Focus fully on finishing just your first micro-action item right now."
        else:
            reply = f"Clock is ticking on '{objective}'. Send 'break it down' to get a streamlined action list."
        return jsonify({"objective": objective, "tactical_subtasks": [reply]}), 200

    prompt = f"You are Ace, an aggressive productivity AI teammate. Guide the user into smashing objective: '{objective}', workload: '{workload}', input: '{user_message}'"
    try:
        response = ai_client.models.generate_content(model="gemini-2.5-flash", contents=prompt)
        return jsonify({"objective": objective, "tactical_subtasks": [response.text.strip()]}), 200
    except Exception:
        return jsonify({"objective": objective, "tactical_subtasks": ["Sensor flicker. Keep pushing the deadline!"]}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)