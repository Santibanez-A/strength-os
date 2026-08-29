import { useState } from "react";

function ExerciseForm({ onExerciseCreated, onError }) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");

  function handleSubmit(event) {
  event.preventDefault();

  onError("");

  fetch("/api/exercises", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      name: name,
      category: category,
    }),
  })
    .then((response) => {
      if (!response.ok) {
        return response.json().then((data) => {
          throw new Error(
            data.errors?.join(", ") ||
            "Unable to create exercise"
          );
        });
      }

      return response.json();
    })
    .then((newExercise) => {
      onExerciseCreated(newExercise);

      setName("");
      setCategory("");
    })
    .catch((error) => {
      onError(error.message);
    });
}

return (
  <section>
    <h2>Add Exercise</h2>

    <form onSubmit={handleSubmit}>
      <label>
        Exercise Name
        <input
          type="text"
          value={name}
          onChange={(event) =>
            setName(event.target.value)
          }
          placeholder="Exercise"
        />
      </label>

      <label>
        Category
        <input
          type="text"
          value={category}
          onChange={(event) =>
            setCategory(event.target.value)
          }
          placeholder="Exercise Type"
        />
      </label>

      <button type="submit">
        Add Exercise
      </button>
    </form>
  </section>
);
}

export default ExerciseForm;