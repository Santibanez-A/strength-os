function WorkoutCard({
  workout,
  formatDuration,
  onUpdate,
  onDelete,
}) {
  return (
    <article>
      <h3>{workout.date}</h3>

      <p>
        Duration: {formatDuration(workout.duration_minutes)}
      </p>

      <p>{workout.notes}</p>

      <button onClick={() => onUpdate(workout)}>
        Edit
      </button>

      <button onClick={() => onDelete(workout.id)}>
        Delete
      </button>
    </article>
  );
}

export default WorkoutCard;