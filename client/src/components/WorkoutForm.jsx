import { useState } from "react";

function WorkoutForm({onWorkoutCreated, onError}) {
  const [date, setDate] = useState("");
  const [durationHours, setDurationHours] = useState("");
  const [durationMinutes, setDurationMinutes] = useState("");
  const [notes, setNotes] = useState("");

  function handleSubmit(event) {
  event.preventDefault();
  onError("");

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
      onWorkoutCreated(newWorkout);

      setDate("");
      setDurationHours("");
      setDurationMinutes("");
      setNotes("");
    })
    .catch((error) => {
      onError(error.message);
    });
    }


  return (
  <section>
    <h2>Create Workout</h2>

    <form onSubmit={handleSubmit}>
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
);
}

export default WorkoutForm;