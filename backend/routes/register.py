from flask import Blueprint, request, jsonify
import sqlite3

register_bp = Blueprint("register", __name__)

@register_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    if not data.email:
        return "The email value is invalid!"
    elif not data.password:
        return "The password data is invalid!"
    elif data.password != data.confirmPassword:
        return "The password and the confirmPassword values do not match!"
    else:
        add_user(data)
        print("data", data)
        return jsonify({"ok": True})

def add_user(data):
    email = data.email
    password = data.password