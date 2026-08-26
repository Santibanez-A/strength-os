import { useState } from "react";

function WorkoutEntryForm({
  workouts,
  exercises,
  onEntryCreated,
  onError,
}) {
  const [selectedWorkoutId, setSelectedWorkoutId] = useState("");
  const [selectedExerciseId, setSelectedExerciseId] = useState("");
  const [weight, setWeight] = useState("");
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");
  const [rir, setRir] = useState("");

  function handleSubmit(event) {
  event.preventDefault();
  onError("");

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
      onEntryCreated(newEntry);

      setSelectedExerciseId("");
      setWeight("");
      setSets("");
      setReps("");
      setRir("");
    })
    .catch((error) => {
      onError(error.message);
    });
}

  return (
  <section>
    <h2>Log Exercise</h2>

    <form onSubmit={handleSubmit}>
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
);
}

export default WorkoutEntryForm;