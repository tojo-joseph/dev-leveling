from flask import Blueprint, make_response, request, jsonify, session, g
from werkzeug.security import check_password_hash
from database import close, connect
from dotenv import load_dotenv
import os
import jwt
import datetime

load_dotenv()

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
    accessToken = generate_token(session["user_id"])
    close()
    res = make_response(jsonify({"ok": True, "accessToken": accessToken}))
    res.set_cookie("accessToken", accessToken, httponly=True, secure=False, samesite="Lax", max_age=1000 * 60 * 60 * 24, path="/")
    return res


def generate_token(user_id):
    payload = {
        'user_id': user_id,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)
    }
    secret_key = os.environ.get('SECRET_KEY')
    token = jwt.encode(payload, secret_key, algorithm='HS256')
    return token