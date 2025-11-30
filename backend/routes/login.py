from flask import Blueprint, request, jsonify, session, g
from werkzeug.security import check_password_hash
from database import close, connect

login_bp = Blueprint("login", __name__)

@login_bp.route("/login", methods=["POST"])
def login():
    connect()
    session.clear()
    data = request.get_json()
    if not data["username"]:
        return "The username value is invalid!"
    elif not data["password"]:
        return "The password data is invalid!"
    
    rows = g.cursor.execute("SELECT * FROM users WHERE username = ?", (data["username"], ))
    rows = rows.fetchall()

    if len(rows) != 1 or not check_password_hash(rows[0][2], data["password"]):
        return "Invalid username and/or password"
    
    session["user_id"] = rows[0][0]
    close()
    return jsonify({"ok": True})