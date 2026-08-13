from flask import Flask, request, session
from flask_cors import CORS
from marshmallow import ValidationError
from config import db, migrate, bcrypt, Config
from models import User, Workout, Exercise, WorkoutEntry
from datetime import date

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

def get_current_user():
    user_id = session.get("user_id")

    if not user_id:
        return None

    return User.query.get(user_id)


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


@app.get("/workouts")
def get_workouts():
    user = get_current_user()

    if not user:
        return {"error": "Unauthorized"}, 401

    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 10, type=int)

    pagination = Workout.query.filter_by(
        user_id=user.id
    ).paginate(
        page=page,
        per_page=per_page,
        error_out=False
    )

    workouts = pagination.items

    return {
        "workouts": [
            {
                "id": workout.id,
                "date": workout.date.isoformat(),
                "duration_minutes": workout.duration_minutes,
                "notes": workout.notes,
                "user_id": workout.user_id
            }
            for workout in workouts
        ],
        "page": pagination.page,
        "per_page": pagination.per_page,
        "total": pagination.total,
        "pages": pagination.pages
    }, 200

@app.post("/workouts")
def create_workout():
    user = get_current_user()

    if not user:
        return {"error": "Unauthorized"}, 401

    data = request.get_json() or {}

    try:
        workout = Workout(
            date=data.get("date"),
            duration_minutes=data.get("duration_minutes"),
            notes=data.get("notes"),
            user_id=user.id
        )

        db.session.add(workout)
        db.session.commit()

        return {
            "id": workout.id,
            "date": workout.date.isoformat(),
            "duration_minutes": workout.duration_minutes,
            "notes": workout.notes,
            "user_id": workout.user_id
        }, 201

    except Exception as error:
        db.session.rollback()

        return {
            "errors": [str(error)]
        }, 422

@app.get("/workouts/<int:id>")
def get_workout_by_id(id):
    user = get_current_user()

    if not user:
        return {"error": "Unauthorized"}, 401

    workout = Workout.query.filter_by(
        id=id,
        user_id=user.id
    ).first()

    if not workout:
        return {"error": "Workout not found"}, 404

    return {
        "id": workout.id,
        "date": workout.date.isoformat(),
        "duration_minutes": workout.duration_minutes,
        "notes": workout.notes,
        "user_id": workout.user_id
    }, 200


@app.patch("/workouts/<int:id>")
def update_workout(id):
    user = get_current_user()

    if not user:
        return {"error": "Unauthorized"}, 401

    workout = Workout.query.filter_by(
        id=id,
        user_id=user.id
    ).first()

    if not workout:
        return {"error": "Workout not found"}, 404

    data = request.get_json() or {}

    try:
        if "date" in data:
            workout.date = date.fromisoformat(data["date"])

        if "duration_minutes" in data:
            workout.duration_minutes = data["duration_minutes"]

        if "notes" in data:
            workout.notes = data["notes"]

        db.session.commit()

        return {
            "id": workout.id,
            "date": workout.date.isoformat(),
            "duration_minutes": workout.duration_minutes,
            "notes": workout.notes,
            "user_id": workout.user_id
        }, 200

    except Exception as error:
        db.session.rollback()

        return {
            "errors": [str(error)]
        }, 422


@app.delete("/workouts/<int:id>")
def delete_workout(id):
    user = get_current_user()

    if not user:
        return {"error": "Unauthorized"}, 401

    workout = Workout.query.filter_by(
        id=id,
        user_id=user.id
    ).first()

    if not workout:
        return {"error": "Workout not found"}, 404

    db.session.delete(workout)
    db.session.commit()

    return "", 204   

@app.get("/workout_entries")
def get_workout_entries():
    user = get_current_user()

    if not user:
        return {"error": "Unauthorized"}, 401

    entries = (
        WorkoutEntry.query
        .join(Workout)
        .filter(Workout.user_id == user.id)
        .all()
    )

    return [
        {
            "id":entry.id,
            "workout_id":entry.workout_id,
            "exercise_id":entry.exercise_id,
            "weight": entry.weight,
            "sets": entry.sets,
            "reps": entry.reps,
            "rir": entry.rir
        }
        for entry in entries
    ], 200


@app.get("/workout_entries/<int:id>")
def get_workout_entry_by_id(id):
    user = get_current_user()

    if not user:
        return {"error": "Unauthorized"}, 401

    entry = (
        WorkoutEntry.query
        .join(Workout)
        .filter(
            WorkoutEntry.id == id,
            Workout.user_id == user.id
        )
        .first()
    )

    if not entry:
        return {"error": "Workout entry not found"}, 404

    return {
        "id": entry.id,
        "workout_id": entry.workout_id,
        "exercise_id": entry.exercise_id,
        "weight": entry.weight,
        "sets": entry.sets,
        "reps": entry.reps,
        "rir": entry.rir
    }, 200

@app.post("/workout_entries")
def create_workout_entry():
    user = get_current_user()

    if not user:
        return {"error": "Unauthorized"}, 401

    data = request.get_json() or {}

    workout = Workout.query.filter_by(
        id=data.get("workout_id"),
        user_id=user.id
    ).first()

    if not workout:
        return {"error": "Workout not found"}, 404

    exercise = Exercise.query.get(
        data.get("exercise_id")
    )

    if not exercise:
        return {"error": "Exercise not found"}, 404

    try:
        entry = WorkoutEntry(
            workout_id=workout.id,
            exercise_id=exercise.id,
            weight=data.get("weight"),
            sets=data.get("sets"),
            reps=data.get("reps"),
            rir=data.get("rir")
        )

        db.session.add(entry)
        db.session.commit()

        return {
            "id": entry.id,
            "workout_id": entry.workout_id,
            "exercise_id": entry.exercise_id,
            "weight": entry.weight,
            "sets": entry.sets,
            "reps": entry.reps,
            "rir": entry.rir
        }, 201

    except Exception as error:
        db.session.rollback()

        return {"errors": [str(error)]}, 422

@app.patch("/workout_entries/<int:id>")
def update_workout_entry(id):
    user = get_current_user()

    if not user:
        return {"error": "Unauthorized"}, 401

    entry = (
        WorkoutEntry.query
        .join(Workout)
        .filter(
            WorkoutEntry.id == id,
            Workout.user_id == user.id
        )
        .first()
    )

    if not entry:
        return {"error": "Workout entry not found"}, 404

    data = request.get_json() or {}

    try:
        if "exercise_id" in data:
            exercise = Exercise.query.get(data["exercise_id"])

            if not exercise:
                return {"error": "Exercise not found"}, 404

            entry.exercise_id = exercise.id

        if "weight" in data:
            entry.weight = data["weight"]

        if "sets" in data:
            entry.sets = data["sets"]

        if "reps" in data:
            entry.reps = data["reps"]

        if "rir" in data:
            entry.rir = data["rir"]

        db.session.commit()

        return {
            "id": entry.id,
            "workout_id": entry.workout_id,
            "exercise_id": entry.exercise_id,
            "weight": entry.weight,
            "sets": entry.sets,
            "reps": entry.reps,
            "rir": entry.rir
        }, 200

    except Exception as error:
        db.session.rollback()
        return {"errors": [str(error)]}, 422

@app.delete("/workout_entries/<int:id>")
def delete_workout_entry(id):
    user = get_current_user()

    if not user:
        return {"error": "Unauthorized"}, 401

    entry = (
        WorkoutEntry.query
        .join(Workout)
        .filter(
            WorkoutEntry.id == id,
            Workout.user_id == user.id
        )
        .first()
    )

    if not entry:
        return {"error": "Workout entry not found"}, 404

    db.session.delete(entry)
    db.session.commit()

    return "", 204


@app.get("/exercises")
def get_exercises():
    exercises = Exercise.query.order_by(Exercise.name).all()

    return [
        {
            "id": exercise.id,
            "name": exercise.name,
            "category": exercise.category
        }
        for exercise in exercises
    ], 200

@app.get("/exercises/<int:id>")
def get_exercise_by_id(id):
    exercise = db.session.get(Exercise, id)

    if not exercise:
        return {"error": "Exercise not found"}, 404

    return {
        "id": exercise.id,
        "name": exercise.name,
        "category": exercise.category
    }, 200


@app.post("/exercises")
def create_exercise():
    user = get_current_user()

    if not user:
        return {"error": "Unauthorized"}, 401

    data = request.get_json() or {}

    try:
        exercise = Exercise(
            name=data.get("name"),
            category=data.get("category")
        )

        db.session.add(exercise)
        db.session.commit()

        return {
            "id": exercise.id,
            "name": exercise.name,
            "category": exercise.category
        }, 201

    except Exception as error:
        db.session.rollback()

        return {
            "errors": [str(error)]
        }, 422

@app.patch("/exercises/<int:id>")
def update_exercise(id):
    user = get_current_user()

    if not user:
        return {"error": "Unauthorized"}, 401

    exercise = db.session.get(Exercise, id)

    if not exercise:
        return {"error": "Exercise not found"}, 404

    data = request.get_json() or {}

    try:
        if "name" in data:
            exercise.name = data["name"]

        if "category" in data:
            exercise.category = data["category"]

        db.session.commit()

        return {
            "id": exercise.id,
            "name": exercise.name,
            "category": exercise.category
        }, 200

    except Exception as error:
        db.session.rollback()

        return {
            "errors": [str(error)]
        }, 422

@app.delete("/exercises/<int:id>")
def delete_exercise(id):
    user = get_current_user()

    if not user:
        return {"error": "Unauthorized"}, 401

    exercise = db.session.get(Exercise, id)

    if not exercise:
        return {"error": "Exercise not found"}, 404

    if exercise.workout_entries:
        return {
            "error": "Cannot delete an exercise used in workout entries."
        }, 409

    db.session.delete(exercise)
    db.session.commit()

    return "", 204


if __name__ == "__main__":
    app.run(port=5555, debug=True)