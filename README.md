# StrengthOS

StrengthOS is a full-stack strength training application designed to help users log workouts, track individual exercises, and maintain a personal training history.

The application focuses on simple and practical workout tracking. Users can create workout sessions, record exercises performed during those sessions, track weight, sets, reps, and Reps in Reserve (RIR), and update or remove their training data as needed.

StrengthOS was built as a full-stack software engineering project using a React frontend, Flask backend, SQLAlchemy ORM, and a relational database.

## Features

- User signup, login, logout, and session authentication
- Protected user-specific workout data
- Create, read, update, and delete workouts
- Create, read, update, and delete workout entries
- Associate exercises with individual workouts
- Track:
  - Exercise
  - Weight
  - Sets
  - Reps
  - Reps in Reserve (RIR)
- Enter workout duration using hours and minutes
- Human-readable workout duration display
- Persistent workout history
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

### Environment Variables

Create a `.env` file in the project root and configure:

```text
DATABASE_URL=your_postgresql_database_url
SECRET_KEY=your_secret_key
```

These values are loaded using `python-dotenv` and used by the Flask application for the database connection and session security.

### Backend

- Python
- Flask
- Flask-SQLAlchemy
- Flask-Migrate
- Flask-Bcrypt
- Flask-CORS
- Marshmellow
- Marshmellow-SQLAlchemy
- python-dotenv
### Database

- SQL relational database
- SQLAlchemy ORM
- Flask-Migrate for database migrations

## Application Structure

StrengthOS uses a React frontend that communicates with a Flask REST API.

The general application flow is:

User → React Interface → Flask API → SQLAlchemy → Database

Vite is configured with a development proxy so frontend requests to `/api` are forwarded to the Flask server.

## Data Relationships

StrengthOS uses related database resources to represent training data.

### User

A user owns workouts and authenticated application data.

### Workout

A workout represents an individual training session and includes information such as:

- Date
- Duration
- Notes

Each workout belongs to a user.

### Exercise

An exercise represents a movement that can be performed during a workout, such as Bench Press or Back Squat.

### Workout Entry

A workout entry connects a workout with an exercise and stores the performance data for that exercise.

Workout entries can include:

- Weight
- Sets
- Reps
- RIR

This creates the relationship:

User → Workouts → Workout Entries → Exercises

## CRUD Functionality

StrengthOS provides full CRUD functionality for its primary training resources.

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

## Authentication and Authorization

StrengthOS uses session-based authentication.

StrengthOS uses Flask session-based authentication. After a successful login, Flask stores the authenticated user's ID in the session. React includes the session cookie with protected API requests.

Protected backend routes verify the authenticated user's identity before allowing access to private resources.

Workout ownership is enforced so one user cannot access another user's workout history.

## Running the Project Locally

### Backend

From the project directory:

```bash
pipenv shell
cd server
python app.py
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
- Responsive layouts for different screen sizes

The goal is to provide a functional training interface with a visual identity that feels appropriate for strength and performance tracking.

## Future Improvements

Potential future features include:

- Estimated one-rep max calculations
- Percentage-based training recommendations
- Personal record tracking
- Exercise progress history
- Strength charts
- User profiles
- Leaderboards
- Social features
- Training programs and progression cycles

## Author

Adrian Santibanez