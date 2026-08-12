from sqlalchemy.orm import validates

from config import db, bcrypt


class User(db.Model):
    __tablename__ = "users"
    #properties
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, nullable=False, unique=True)
    email = db.Column(db.String, nullable=False, unique=True)
    password_hash = db.Column(db.String, nullable=False)

    #relations
    workouts = db.relationship(
        "Workout",
        back_populates="user",
        cascade="all, delete-orphan"
    )

    #validation
    @validates("username","email")
    def validate_required_fields(self, key, value):
        if not value or not value.strip():
            raise ValueError(f'{key} is required.')
        
        return value.strip()

    def set_password(self, password):
        if not password or len(password) < 0:
            raise ValueError(
                "Password must be at least 6 characters."
            )
        self.password_hash = bcrypt.generate_password_hash(
            password
        ).decode("utf-8")

    def authenticate(self, password):
        return bcrypt.check_password_hash(
            self.password_hash,
            password
        )
    

class Workout(db.Model):
    __tablename__ = "workouts"
    #properties
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.Date, nullable=False)
    duration_minutes = db.Column(db.Integer, nullable=True)
    notes = db.Column(db.Text)

    #ForeignKey
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)

    #relations
    user = db.relationship(
        "User",
        back_populates="workouts"
    )

    workout_entries = db.relationship(
        "WorkoutEntry",
        back_populates="workout",
        cascade="all, delete-orphan"
    )

    #constraints
    __table_args__ = (
        db.CheckConstraint(
            "duration_minutes > 0",
            name="check_duration_minutes_positive"
        ),
    )

    #validations
    @validates("duration_minutes")
    def validate_duration_minutes(self, key, duration_minutes):
        if duration_minutes <= 0:
            raise ValueError(
                "Workout duration must be greater than zero."
            )
        return duration_minutes

class Exercise(db.Model):
    __tablename__ = "exercises"

    #properties
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False, unique=True)
    category = db.Column(db.String, nullable=False)

    #relations
    workout_entries = db.relationship(
        "WorkoutEntry",
        back_populates="exercise"
    )

    #validation
    @validates("name")
    def valdiate_name(self, key, name):
        if not name or not name.strip():
            raise ValueError(
                "Exercise name required."
            )
        return name.strip()

class WorkoutEntry(db.Model):
    __tablename__ = "workout_entries"

    #properties
    id = db.Column(db.Integer, primary_key=True)
    weight = db.Column(db.Float, nullable=False)
    sets = db.Column(db.Integer, nullable=False)
    reps = db.Column(db.Integer, nullable=False)
    rir = db.Column(db.Integer, nullable=False)

    #foreignKey
    workout_id = db.Column(db.Integer, db.ForeignKey("workouts.id"), nullable=False)
    exercise_id = db.Column(db.Integer, db.ForeignKey("exercises.id"), nullable=False)

    #relationships
    workout = db.relationship(
        "Workout",
        back_populates="workout_entries"

    )
    exercise = db.relationship(
        "Exercise",
        back_populates="workout_entries"

    )

    #constraints
    __table_args__ = (
        db.CheckConstraint(
            "weight >= 0",
            name="check_weight_nonnegative"
        ),
        db.CheckConstraint(
            "sets > 0",
            name="check_sets_positive"
        ),
        db.CheckConstraint(
            "reps > 0",
            name="check_reps_nonnegative"
        ),
        db.CheckConstraint(
            "rir IS NULL OR (rir >= 0 AND rir <= 10)",
            name="check_rir_range"
        ),
    )

