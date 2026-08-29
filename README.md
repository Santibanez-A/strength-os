# StrengthOS

StrengthOS is a full-stack strength training application designed to help users log workouts, track exercises, monitor personal records, estimate strength levels, and receive percentage-based training guidance.

The application focuses on practical workout tracking and strength progression. Users can create workout sessions, record exercises performed during those sessions, track weight, sets, reps, and Reps in Reserve (RIR), and update or remove their training data as needed.

StrengthOS also analyzes logged training data to calculate estimated one-rep maxes, identify estimated personal records, and generate training weights based on a user's current estimated strength.

StrengthOS was built as a full-stack software engineering project using a React frontend, Flask backend, SQLAlchemy ORM, and a relational database.

## Features

- User signup, login, logout, and session authentication
- Protected user-specific workout data
- Create, read, update, and delete workouts
- Create, read, update, and delete workout entries
- Create custom exercises
- Associate exercises with individual workouts
- Track:
  - Exercise
  - Weight
  - Sets
  - Reps
  - Reps in Reserve (RIR)
- Optional RIR logging
- Enter workout duration using hours and minutes
- Human-readable workout duration display
- Persistent workout history
- Estimated one-rep max (1RM) calculations
- Estimated personal record detection
- Personal Records dashboard
- Percentage-based training guidance
- Training weights calculated from 60% through 90% of estimated 1RM
- Validation for invalid weight, set, and rep values
- High-repetition sets above 20 reps excluded from estimated 1RM and PR calculations
- User ownership protection so users only access their own workout data
- Responsive military-inspired interface
- Black, OD green, and tan StrengthOS visual theme

## Tech Stack

### Frontend

- React
- React Router
- JavaScript
- Vite
- CSS

### Backend

- Python
- Flask
- Flask-SQLAlchemy
- Flask-Migrate
- Flask-Bcrypt
- Flask-CORS
- Marshmallow
- Marshmallow-SQLAlchemy
- python-dotenv

### Database

- SQL relational database
- SQLAlchemy ORM
- Flask-Migrate for database migrations

### Environment Variables

Create a `.env` file in the project root and configure:

```text
DATABASE_URL=your_postgresql_database_url
SECRET_KEY=your_secret_key
```

These values are loaded using `python-dotenv` and used by the Flask application for the database connection and session security.

## Application Structure

StrengthOS uses a React frontend that communicates with a Flask REST API.

The general application flow is:

```text
User
  ↓
React Interface
  ↓
Flask REST API
  ↓
SQLAlchemy ORM
  ↓
Relational Database
```

Vite is configured with a development proxy so frontend requests to `/api` are forwarded to the Flask server.

The React frontend is divided into reusable components responsible for workout creation, exercise creation, workout entry logging, workout display, personal records, and training guidance.

## Data Relationships

StrengthOS uses related database resources to represent training data.

### User

A user owns workouts and authenticated application data.

### Workout

A workout represents an individual training session and includes:

- Date
- Duration
- Notes

Each workout belongs to a user.

### Exercise

An exercise represents a movement that can be performed during a workout, such as Bench Press or Back Squat. Users can also add custom exercises to the exercise library.

### Workout Entry

A workout entry connects a workout with an exercise and stores performance data for that exercise.

Workout entries include:

- Weight
- Sets
- Reps
- RIR

This creates the relationship:

```text
User
  ↓
Workouts
  ↓
Workout Entries
  ↓
Exercises
```

## Strength Analysis

### Estimated One-Rep Max

StrengthOS calculates an estimated one-rep max from logged weight and repetitions.

Rather than relying on a single estimation method, the application calculates multiple established 1RM formulas and averages their results to provide a single estimated maximum.

High-repetition sets above 20 reps are excluded from estimated 1RM calculations because 1RM formulas become less useful at high repetition ranges.

### Personal Records

StrengthOS compares estimated 1RM values for entries belonging to the same exercise.

The entry with the highest valid estimated 1RM is identified as the user's current estimated personal record and receives a PR indicator in the workout entry interface.

Personal Records automatically update when workout entries are created, edited, or deleted.

### Training Guidance

StrengthOS uses the current estimated personal record for an exercise to calculate suggested training weights.

Training guidance is provided at:

- 60%
- 70%
- 75%
- 80%
- 85%
- 90%

Users can select an exercise from the Training Guidance section to view percentage-based weights derived from their current estimated 1RM.

## CRUD Functionality

### Workouts

Users can:

- Create workouts
- View workouts
- Edit workouts
- Delete workouts

### Workout Entries

Users can:

- Add exercises to workouts
- View logged exercises
- Edit exercise performance data
- Delete workout entries

### Exercises

Users can create custom exercises that can immediately be selected when logging workout entries.

## Authentication and Authorization

StrengthOS uses Flask session-based authentication.

After a successful login, Flask stores the authenticated user's ID in the session. React includes the session cookie with protected API requests.

Protected backend routes verify the authenticated user's identity before allowing access to private resources.

Workout ownership is enforced so one user cannot access another user's workout history.

## Running the Project Locally

### Backend

From the project directory:

```bash
pipenv shell
cd server
flask run --port 5555
```

The Flask API runs on port `5555`.

### Frontend

Open another terminal:

```bash
cd client
npm install
npm run dev
```

Vite will provide the local frontend address, typically:

```text
http://localhost:5173
```

## API Routes

### Authentication

```text
POST   /signup
POST   /login
DELETE /logout
GET    /check_session
```

### Workouts

```text
GET    /workouts
GET    /workouts/:id
POST   /workouts
PATCH  /workouts/:id
DELETE /workouts/:id
```

### Exercises

```text
GET    /exercises
GET    /exercises/:id
POST   /exercises
PATCH  /exercises/:id
DELETE /exercises/:id
```

### Workout Entries

```text
GET    /workout_entries
GET    /workout_entries/:id
POST   /workout_entries
PATCH  /workout_entries/:id
DELETE /workout_entries/:id
```

## Design

StrengthOS uses a military-inspired visual identity built around:

- Black and charcoal backgrounds
- OD green primary elements
- Tan highlights
- High-contrast workout cards
- PR crosshair indicators
- Responsive layouts for desktop and mobile devices

The goal is to provide a functional strength-training interface with a visual identity appropriate for strength and performance tracking.

## Future Improvements

Potential future features include:

- Exercise progress history
- Strength progression charts
- User profiles
- Leaderboards
- Social features
- Training programs and progression cycles
- Historical PR tracking
- More advanced strength analytics

## Author

Adrian Santibanez