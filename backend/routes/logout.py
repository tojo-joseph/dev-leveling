from flask import Blueprint, jsonify, make_response, session, g
from database import save, connect, close

logout_bp = Blueprint("logout", __name__)

@logout_bp.route("/logout", methods=["POST"])
def logout():
    if "user_id" not in session:
        return jsonify({"ok": False, "error": "Not logged in"}), 401

    try:
        connect()
        
        
        g.cursor.execute("SELECT * FROM users WHERE id = ?", (session["user_id"],))
        current_user = g.cursor.fetchone()  
        
        if current_user and len(current_user) > 4:  
            
            if current_user[3] == 'github':
                g.cursor.execute("""
                    UPDATE users
                    SET github_token = NULL 
                    WHERE id = ?
                """, (session["user_id"],))
                save()
        
        
        session.clear()
        
       
        response = make_response(jsonify({"ok": True}))
        response.set_cookie(
            "accessToken",
            "",
            max_age=0,
            expires=0,
            httponly=True,
            secure=False,
            samesite="Lax",
            path="/"
        )
        return response
        
    except Exception as e:
        return jsonify({"ok": False, "error": str(e)}), 500
        
    finally:
        close()  