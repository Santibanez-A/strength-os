import { useEffect, useState } from "react";

function Dashboard({ user }) {
  const [workouts, setWorkouts] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:5555/workouts", {
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

  return (
    <main>
      <h1>Dashboard</h1>
      <p>Welcome, {user.username}</p>

      <h2>Your Workouts</h2>

      {error && <p>{error}</p>}

      {workouts.length === 0 ? (
        <p>No workouts yet.</p>
      ) : (
        workouts.map((workout) => (
          <article key={workout.id}>
            <h3>{workout.date}</h3>
            <p>Duration: {workout.duration_minutes} minutes</p>
            <p>{workout.notes}</p>
          </article>
        ))
      )}
    </main>
  );
}

export default Dashboard;