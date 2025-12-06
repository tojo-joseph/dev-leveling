from flask import Blueprint, request, make_response, jsonify, session, g
from dotenv import load_dotenv
import os
import requests

load_dotenv()

GITHUB_CLIENT_ID = os.getenv("CLIENT_ID")
GITHUB_CLIENT_SECRET = os.getenv("CLIENT_SECRET")

gh_access_bp = Blueprint("ghaccess", __name__)

@gh_access_bp.route("/ghaccess", methods=["GET"])
def ghaccess():
    code = request.args.get("code")
    

    token_url = "https://github.com/login/oauth/access_token"
    params = {
        "client_id": GITHUB_CLIENT_ID,
        "client_secret": GITHUB_CLIENT_SECRET,
        "code": code
    }

    headers = {
        "Accept": "application/json"
    }

    response = requests.post(url=token_url, data=params, headers=headers)
    token_data= response.json()
    print("token_data", token_data)

    username = token_data["access_token"]

    rows = g.cursor.execute("SELECT * FROM users WHERE username = ?", (username, ))
    rows = rows.fetchall()

    if len(rows) == 0:
        g.cursor.execute("INSERT INTO users (username, hash, oauth_provider) VALUES (?, ?, ?)", )

    session["user_id"] = rows[0][0]

    accessToken = token_data.get('access_token')

    res = make_response(jsonify({"ok": True, "accessToken": accessToken}))
    res.set_cookie("accessToken", accessToken, httponly=True, secure=False, samesite="Lax", max_age=1000 * 60 * 60 * 24, path="/")

    return token_data

gh_user_data_bp = Blueprint("gh_user_data_bp", __name__)

@gh_user_data_bp.route("/get_user_data", methods=["GET"])
def get_user_data():
    auth_header = request.headers.get("Authorization")
    url = "https://api.github.com/user"
    headers = {
        "Authorization": auth_header,
    }
    
    response = requests.get(url, headers=headers)
    print("responseData", response.json())
    
    return response.json()
    

# gh_login_bp = Blueprint("ghlogin", __name__)

# @gh_login_bp.route("/ghlogin", methods=["POST"])
# def ghlogin():
#     connect()
#     session.clear()
