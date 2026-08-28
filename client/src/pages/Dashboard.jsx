import { useEffect, useState } from "react";
import WorkoutCard from "../components/WorkoutCard";
import WorkoutEntryCard from "../components/WorkoutEntryCard";
import WorkoutForm from "../components/WorkoutForm";
import WorkoutEntryForm from "../components/WorkoutEntryForm";
import PersonalRecords from "../components/PersonalRecords";

function Dashboard({ user }) {
  const [workouts, setWorkouts] = useState([]);
  const [error, setError] = useState("");

  const [exercises, setExercises] = useState([]);
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    fetch("/api/workouts", {
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Unable to load workouts");
        }

        return response.json();
      })
      .then((data) => {
        setWorkouts(data.workouts || []);
      })
      .catch((error) => {
        setError(error.message);
      });
  }, []);

  useEffect(() => {
  fetch("/api/exercises")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Unable to load exercises");
      }

      return response.json();
    })
    .then((data) => {
      setExercises(data);
    })
    .catch((error) => {
      setError(error.message);
    });

  fetch("/api/workout_entries", {
    credentials: "include",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Unable to load workout entries");
      }

      return response.json();
    })
    .then((data) => {
      setEntries(data);
    })
    .catch((error) => {
      setError(error.message);
    });
}, []);  

function handleUpdateEntry(entry) {
  const newWeight = window.prompt(
    "Weight:",
    entry.weight
  );

  if (newWeight === null) return;

  const newSets = window.prompt(
    "Sets:",
    entry.sets
  );

  if (newSets === null) return;

  const newReps = window.prompt(
    "Reps:",
    entry.reps
  );

  if (newReps === null) return;

  const newRir = window.prompt(
    "RIR:",
    entry.rir ?? ""
  );

  if (newRir === null) return;

  fetch(`/api/workout_entries/${entry.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      weight: Number(newWeight),
      sets: Number(newSets),
      reps: Number(newReps),
      rir: newRir === "" ? null : Number(newRir),
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Unable to update workout entry");
      }

      return response.json();
    })
    .then((updatedEntry) => {
      setEntries((currentEntries) =>
        currentEntries.map((entry) =>
          entry.id === updatedEntry.id
            ? updatedEntry
            : entry
        )
      );
    })
    .catch((error) => {
      setError(error.message);
    });
}

function handleDeleteEntry(id) {
  const confirmed = window.confirm(
    "Are you sure you want to delete this workout entry?"
  );

  if (!confirmed) return;

  fetch(`/api/workout_entries/${id}`, {
    method: "DELETE",
    credentials: "include",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Unable to delete workout entry");
      }

      setEntries((currentEntries) =>
        currentEntries.filter(
          (entry) => entry.id !== id
        )
      );
    })
    .catch((error) => {
      setError(error.message);
    });
}

function handleUpdateWorkout(workout) {
  const newDuration = window.prompt(
    "Duration in minutes:" ,
    workout.duration_minutes
  );

  if (newDuration == null) return;

  const newNotes = window.prompt(
    "Workout notes:",
    workout.notes || ""
  );

  if (newNotes == null) return;

  fetch(`/api/workouts/${workout.id}`, {
    method:"PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      duration_minutes: Number(newDuration),
      notes: newNotes,
    }),
  })
  .then((response) => {
    if (!response.ok) {
      throw new Error("Unable to update workout");
    }

    return response.json();
  })
  .then((updatedWorkout) => {
    setWorkouts((currentWorkouts) =>
      currentWorkouts.map((workout) =>
        workout.id == updatedWorkout.id
          ? updatedWorkout
          : workout
        )
      );  
  })
  .catch((error) => {
    setError(error.message);
  });
}

function handleDeleteWorkout(id) {
  const confirmed = window.confirm(
    "Are you sure you want to delete this workout?"
  );

  if (!confirmed) return;

  fetch(`/api/workouts/${id}`,{
    method: "DELETE",
    credentials: "include",
  })
  .then((response) => {
    if (!response.ok) {
      throw new Error("Unable to delete workout");
    }

    setWorkouts((currentWorkouts) => 
    currentWorkouts.filter(
      (workout) => workout.id !== id
    )
  );
  })
  .catch((error) => {
    setError(error.message);
  });
}
function formatDuration(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours === 0) {
    return `${minutes} min`;
  }

  if (minutes === 0) {
    return `${hours} hr`;
  }

  return `${hours} hr ${minutes} min`;
}

function handleWorkoutCreated(newWorkout) {
  setWorkouts((currentWorkouts) => [
    ...currentWorkouts,
    newWorkout,
  ]);
}

function handleFormError(message) {
  setError(message);
}
function handleEntryCreated(newEntry) {
  setEntries((currentEntries) => [
    ...currentEntries,
    newEntry,
  ]);
}

return (
  <main>
    <h1>Dashboard</h1>
    <p>Welcome, {user.username}</p>

    {/* CREATE WORKOUT */}
    <WorkoutForm
      onWorkoutCreated={handleWorkoutCreated}
      onError={handleFormError}
    />

    {/* ERROR MESSAGE */}
    {error && <p>{error}</p>}

  {/* LOG EXERCISE */}
  <WorkoutEntryForm
    workouts={workouts}
    exercises={exercises}
    onEntryCreated={handleEntryCreated}
    onError={handleFormError}
  />
  {/* Personal Records */}
  <PersonalRecords
    entries={entries}
    exercises={exercises}
  />

{/* WORKOUT LIST */}
<section>
  <h2>Your Workouts</h2>

  {workouts.length === 0 ? (
    <p>No workouts yet.</p>
  ) : (
    workouts.map((workout) => (
      <WorkoutCard
        key={workout.id}
        workout={workout}
        formatDuration={formatDuration}
        onUpdate={handleUpdateWorkout}
        onDelete={handleDeleteWorkout}
      />
    ))
  )}
</section>

    {/* WORKOUT ENTRY LIST */}
    <section>
      <h2>Workout Entries</h2>

      {entries.length === 0 ? (
        <p>No exercises logged yet.</p>
      ) : (
        entries.map((entry) => (
          <WorkoutEntryCard
            key={entry.id}
            entry={entry}
            entries={entries}
            exercises={exercises}
            onUpdate={handleUpdateEntry}
            onDelete={handleDeleteEntry}
          />
        ))
      )}
    </section>
  </main>
);
}

export default Dashboard;