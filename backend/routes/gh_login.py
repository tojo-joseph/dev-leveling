from flask import Blueprint, request, make_response, jsonify, session, g
from dotenv import load_dotenv
from database import connect, close, save
import os
import requests
import datetime



load_dotenv()

GITHUB_CLIENT_ID = os.getenv("CLIENT_ID")
GITHUB_CLIENT_SECRET = os.getenv("CLIENT_SECRET")

gh_access_bp = Blueprint("ghaccess", __name__)

@gh_access_bp.route("/ghaccess", methods=["GET"])
def ghaccess():
    connect()
    session.clear()
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

    token = token_data["access_token"]

    if token:
        user_data = get_github_user(token)
        

        rows = g.cursor.execute("SELECT * FROM users WHERE username = ?", (user_data["login"], ))
        rows = rows.fetchall()

        if len(rows) == 0:
            g.cursor.execute("INSERT INTO users (username, hash, oauth_provider) VALUES (?, ?, ?)", (user_data["login"], None, "github"))
            user_id = g.cursor.lastrowid
        else:
            user_id = rows[0][0]
        
        g.cursor.execute("""
        UPDATE users
        SET github_token = ? WHERE id = ?
        """, (token, user_id))

        save()

        session["user_id"] = user_id

        res = make_response(jsonify({"ok": True, "accessToken": token, "user_data": user_data, "user_id": user_id}))
        res.set_cookie("accessToken", token, httponly=True, secure=False, samesite="Lax", max_age=1000 * 60 * 60 * 24, path="/")
        close()
        return res
    else:
        close()
        return jsonify({"error": "Failed to obtain access token"}), 400

gh_user_data_bp = Blueprint("gh_user_data_bp", __name__)

@gh_user_data_bp.route("/get_user_data", methods=["GET"])
def get_user_data():
    
    connect()
    current_user_id = session["user_id"]
    token = g.cursor.execute("SELECT * FROM users WHERE id = ?", (current_user_id, )).fetchone()[4]
    data = get_github_user(token)
    response = make_response(jsonify({ "ok": True, "user_id": current_user_id, "user_data": data}))
    
    close()
    return response

gh_commit_bp = Blueprint("gh_commit_bp", __name__)

@gh_commit_bp.route("/get_commit_activity", methods=["GET"])
def get_commit_activity():

    try:
        connect()
        current_user_id = session["user_id"]
        token = g.cursor.execute("SELECT * FROM users WHERE id = ?", (current_user_id, )).fetchone()[4]
        username = g.cursor.execute("SELECT * FROM users WHERE id = ?", (current_user_id, )).fetchone()[1]
        resp = requests.get(
            "https://api.github.com/users/" + username + "/events",
            headers={"Authorization": f"token {token}"}
        )
        resp.raise_for_status()

        events = resp.json()
        commit_activity = process_commit_activity(events)
        return make_response(jsonify({"ok": True, "commit_activity": commit_activity}))
    except Exception as e:
        print(f"Error fetching commit activity: {e}")
        return make_response(jsonify({"ok": False, "error": str(e)}), 500)
    finally:
        close()
    
    
def process_commit_activity(events):
    commits_by_date = {}
    
    for event in events:
        if event["type"] == "PushEvent":
            # Parse the ISO 8601 date string and format as YYYY-MM-DD
            created_at = event['created_at']
            date = datetime.datetime.fromisoformat(created_at.replace('Z', '+00:00')).strftime('%Y-%m-%d')
            commit_count = len(event['payload'].get('commits', []))
            
            if date in commits_by_date:
                commits_by_date[date] += commit_count
            else:
                commits_by_date[date] = commit_count
    
    # Add a log to see the processed data
    print("Processed commits by date:", commits_by_date)
    return commits_by_date

    

# gh_login_bp = Blueprint("ghlogin", __name__)

# @gh_login_bp.route("/ghlogin", methods=["POST"])
# def ghlogin():
#     connect()
#     session.clear()


def get_github_user(access_token: str):
    resp = requests.get(
        "https://api.github.com/user",
        headers={"Authorization": f"token {access_token}"}
    )
    resp.raise_for_status()
    return resp.json()