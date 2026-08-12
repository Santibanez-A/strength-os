from flask import Flask
from flask_cors import CORS

from config import db, migrate, bcrypt, Config
from models import User, Workout, Exercise, WorkoutEntry

app = Flask(__name__)
app.config.from_object(Config)

CORS(
    app,
    supports_credentials=True,
    origins=["http://localhost:5173"]
)

db.init_app(app)
migrate.init_app(app, db)
bcrypt.init_app(app)


@app.get("/")
def home():
    return {"message": "StrengthOS API is running"}, 200


if __name__ == "__main__":
    app.run(port=5555, debug=True)