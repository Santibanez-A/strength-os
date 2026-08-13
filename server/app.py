from flask import Flask, request, session
from flask_cors import CORS
from marshmallow import ValidationError
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


@app.post("/signup")
def signup():
    data = request.get_json() or {}

    try:
        user = User(
            username=data.get("username"),
            email=data.get("email")
        )

        user.set_password(data.get("password"))

        db.session.add(user)
        db.session.commit()

        session["user_id"] = user.id

        return {
            "id": user.id,
            "username": user.username,
            "email": user.email
        }, 201

    except Exception as error:
        db.session.rollback()

        return {
            "errors": [str(error)]
        }, 422

@app.get("/check_session")
def check_session():
    user_id = session.get("user_id")

    if user_id:
        user = User.query.filter_by(id=user_id).first()

        if user:
            return {
                "id": user.id,
                "username": user.username,
                "email": user.email
            }, 200

    return {"error": "Unauthorized"}, 401


@app.post("/login")
def login():
    data = request.get_json() or {}

    user = User.query.filter_by(
        username=data.get("username")
    ).first()

    if user and user.authenticate(data.get("password")):
        session["user_id"] = user.id

        return {
            "id": user.id,
            "username": user.username,
            "email": user.email
        }, 200

    return {"error": "Unauthorized"}, 401


@app.delete("/logout")
def logout():
    user_id = session.get("user_id")

    if user_id:
        session.pop("user_id", None)
        return "", 204

    return {"error": "Unauthorized"}, 401



if __name__ == "__main__":
    app.run(port=5555, debug=True)