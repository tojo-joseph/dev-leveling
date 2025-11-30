from flask import Flask
from flask_cors import CORS
from flask_session import Session
from routes.register import register_bp
from routes.login import login_bp
from routes.logout import logout_bp


app = Flask(__name__)
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)
CORS(app, origins=["http://localhost:3000"], supports_credentials=True)

app.register_blueprint(register_bp, url_prefix="/api")
app.register_blueprint(login_bp, url_prefix="/api")
app.register_blueprint(logout_bp, url_prefix="/api")

if __name__ == "__main__":
    app.run(debug=True)