from datetime import date

from app import app
from config import db
from models import User, Workout, Exercise, WorkoutEntry


with app.app_context():
    print("Clearing old data...")

    WorkoutEntry.query.delete()
    Workout.query.delete()
    Exercise.query.delete()
    User.query.delete()

    print("Creating user...")

    user = User(
        username="santi",
        email="santi@example.com"
    )
    user.set_password("password123")

    db.session.add(user)
    db.session.commit()

    print("Creating exercises...")

    bench_press = Exercise(
        name="Bench Press",
        category="Chest"
    )

    squat = Exercise(
        name="Back Squat",
        category="Legs"
    )

    db.session.add_all([
        bench_press,
        squat
    ])
    db.session.commit()

    print("Creating workout...")

    workout = Workout(
        date=date.today(),
        duration_minutes=60,
        notes="Strength training session",
        user_id=user.id
    )

    db.session.add(workout)
    db.session.commit()

    print("Creating workout entries...")

    bench_entry = WorkoutEntry(
        workout_id=workout.id,
        exercise_id=bench_press.id,
        weight=225,
        sets=4,
        reps=6,
        rir=2
    )

    squat_entry = WorkoutEntry(
        workout_id=workout.id,
        exercise_id=squat.id,
        weight=275,
        sets=3,
        reps=5,
        rir=2
    )

    db.session.add_all([
        bench_entry,
        squat_entry
    ])

    db.session.commit()

    print("Seed complete.")