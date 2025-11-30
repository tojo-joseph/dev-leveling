from flask import Blueprint, jsonify, session

logout_bp = Blueprint("logout", __name__)

@logout_bp.route("/logout", methods=["POST"])
def logout():
    session.clear()
    return jsonify({"ok": True})