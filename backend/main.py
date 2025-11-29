from flask import Flask
from flask_cors import CORS
from routes.register import register_bp

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"], supports_credentials=True)

app.register_blueprint(register_bp, url_prefix="/api")

if __name__ == "__main__":
    app.run(debug=True)