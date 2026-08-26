import { useEffect, useState } from "react";
import WorkoutCard from "../components/WorkoutCard";

function Dashboard({ user }) {
  const [workouts, setWorkouts] = useState([]);
  const [error, setError] = useState("");

  const [date, setDate] = useState("");
  const [durationHours, setDurationHours] = useState("");
  const [durationMinutes, setDurationMinutes] = useState("");
  const [notes, setNotes] = useState("");

  const [exercises, setExercises] = useState([]);
  const [entries, setEntries] = useState([]);

  const [selectedWorkoutId, setSelectedWorkoutId] = useState("");
  const [selectedExerciseId, setSelectedExerciseId] = useState("");
  const [weight, setWeight] = useState("");
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");
  const [rir, setRir] = useState("");


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

  function handleCreateWorkout(event) {
    event.preventDefault();
    setError("");

    fetch("/api/workouts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        date,
        duration_minutes:
          Number(durationHours || 0) * 60 +
          Number(durationMinutes || 0),
          notes,
        }),
      })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((data) => {
            throw new Error(
              data.errors?.[0] || "Unable to create workout"
            );
          });
        }

        return response.json();
      })
      .then((newWorkout) => {
        setWorkouts((currentWorkouts) => [
          ...currentWorkouts,
          newWorkout,
        ]);

        setDate("");
        setDurationHours("");
        setDurationMinutes("");
        setNotes("");
      })
      .catch((error) => {
        setError(error.message);
      });
  }

  function handleCreateEntry(event) {
  event.preventDefault();
  setError("");

  fetch("/api/workout_entries", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      workout_id: Number(selectedWorkoutId),
      exercise_id: Number(selectedExerciseId),
      weight: Number(weight),
      sets: Number(sets),
      reps: Number(reps),
      rir: rir === "" ? null : Number(rir),
    }),
  })
    .then((response) => {
      if (!response.ok) {
        return response.json().then((data) => {
          throw new Error(
            data.errors?.[0] ||
              data.error ||
              "Unable to add workout entry"
          );
        });
      }

      return response.json();
    })
    .then((newEntry) => {
      setEntries((currentEntries) => [
        ...currentEntries,
        newEntry,
      ]);

      setSelectedExerciseId("");
      setWeight("");
      setSets("");
      setReps("");
      setRir("");
    })
    .catch((error) => {
      setError(error.message);
    });
}
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

return (
  <main>
    <h1>Dashboard</h1>
    <p>Welcome, {user.username}</p>

    {/* CREATE WORKOUT */}
    <section>
      <h2>Create Workout</h2>

      <form onSubmit={handleCreateWorkout}>
        <label>
          Date
          <input
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            required
          />
        </label>

<div className="duration-fields">
  <label>
    Hours
    <input
      type="number"
      min="0"
      value={durationHours}
      onChange={(event) =>
        setDurationHours(event.target.value)
      }
      placeholder="0"
    />
  </label>

  <label>
    Minutes
    <input
      type="number"
      min="0"
      max="59"
      value={durationMinutes}
      onChange={(event) =>
        setDurationMinutes(event.target.value)
      }
      placeholder="0"
    />
  </label>
</div>

        <label>
          Notes
          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
          />
        </label>

        <button type="submit">
          Create Workout
        </button>
      </form>
    </section>

    {/* ERROR MESSAGE */}
    {error && <p>{error}</p>}

    {/* LOG EXERCISE */}
    <section>
      <h2>Log Exercise</h2>

      <form onSubmit={handleCreateEntry}>
        <label>
          Workout
          <select
            value={selectedWorkoutId}
            onChange={(event) =>
              setSelectedWorkoutId(event.target.value)
            }
            required
          >
            <option value="">
              Select workout
            </option>

            {workouts.map((workout) => (
              <option
                key={workout.id}
                value={workout.id}
              >
                {workout.date} - {workout.notes}
              </option>
            ))}
          </select>
        </label>

        <label>
          Exercise
          <select
            value={selectedExerciseId}
            onChange={(event) =>
              setSelectedExerciseId(event.target.value)
            }
            required
          >
            <option value="">
              Select exercise
            </option>

            {exercises.map((exercise) => (
              <option
                key={exercise.id}
                value={exercise.id}
              >
                {exercise.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Weight
          <input
            type="number"
            min="0"
            value={weight}
            onChange={(event) =>
              setWeight(event.target.value)
            }
            required
          />
        </label>

        <label>
          Sets
          <input
            type="number"
            min="1"
            value={sets}
            onChange={(event) =>
              setSets(event.target.value)
            }
            required
          />
        </label>

        <label>
          Reps
          <input
            type="number"
            min="0"
            value={reps}
            onChange={(event) =>
              setReps(event.target.value)
            }
            required
          />
        </label>

        <label>
          RIR
          <input
            type="number"
            min="0"
            max="10"
            value={rir}
            onChange={(event) =>
              setRir(event.target.value)
            }
          />
        </label>

        <button type="submit">
          Add Exercise to Workout
        </button>
      </form>
    </section>

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
        entries.map((entry) => {
          const exercise = exercises.find(
            (exercise) =>
              exercise.id === entry.exercise_id
          );

          return (
 <article key={entry.id}>
  <h3>
    {exercise?.name ||
      `Exercise ${entry.exercise_id}`}
  </h3>

  <p>Weight: {entry.weight}</p>
  <p>Sets: {entry.sets}</p>
  <p>Reps: {entry.reps}</p>
  <p>RIR: {entry.rir ?? "Not recorded"}</p>

  <button onClick={() => handleUpdateEntry(entry)}>
    Edit Entry
  </button>

  <button onClick={() => handleDeleteEntry(entry.id)}>
    Delete Entry
  </button>
</article>
          );
        })
      )}
    </section>
  </main>
);
}

export default Dashboard;