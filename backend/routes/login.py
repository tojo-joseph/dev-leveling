from flask import Blueprint, request, jsonify

login_bp = Blueprint("login", __name__)

@login_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    return jsonify({"ok": True})