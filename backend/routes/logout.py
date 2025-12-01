from flask import Blueprint, jsonify, make_response, session

logout_bp = Blueprint("logout", __name__)

@logout_bp.route("/logout", methods=["POST"])
def logout():
    session.clear()
    res = make_response(jsonify({"ok": True}))
    res.set_cookie(
        "accessToken",
        "",
        max_age=0,
        expires=0,
        httponly=True,
        secure=False,
        samesite="Lax",
        path="/"
    )
    return res