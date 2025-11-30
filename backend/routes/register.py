from flask import Blueprint, request, jsonify, g
from database import connect, save, close
from werkzeug.security import generate_password_hash

register_bp = Blueprint("register", __name__)

@register_bp.route("/register", methods=["POST"])
def register():
    connect()
    data = request.get_json()
    if not data["username"]:
        return "The username value is invalid!"
    elif not data["password"]:
        return "The password data is invalid!"
    elif data["password"] != data["confirmPassword"]:
        return "The password and the confirmPassword values do not match!"
    elif username_exists(data["username"]):
        return "The username that you have entered already exists"
    else:
        add_user(data)
        close()
        return jsonify({"ok": True})
        

def add_user(data):
    username = data["username"]
    password = data["password"]
    password_hash = generate_password_hash(password)
    g.cursor.execute("INSERT INTO users (username, hash) VALUES (?, ?)", (username, password_hash))
    return save()

def username_exists(username):
    rows = g.cursor.execute("SELECT username FROM users WHERE username = ?", (username, ))
    if rows.fetchone():
        return True
    else:
        return False

