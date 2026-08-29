import {
  calculateOneRepMax,
  findBestEntry,
} from "../utils/oneRepMax";

function WorkoutEntryCard({
  entry,
  entries,
  exercises,
  onUpdate,
  onDelete,
}) {
  const exercise = exercises.find(
    (exercise) =>
      exercise.id === entry.exercise_id
  );

  const estimatedOneRepMax = calculateOneRepMax(
  entry.weight,
  entry.reps
);

const sameExerciseEntries = entries.filter(
  (otherEntry) =>
    otherEntry.exercise_id === entry.exercise_id
  );

  const bestEntry = findBestEntry(sameExerciseEntries);

  const isEstimatedPr =
  bestEntry?.entry?.id === entry.id;

  return (
    <article>
      <h3>
        {exercise?.name ||
          `Exercise ${entry.exercise_id}`}
      </h3>

      <p>Weight: {entry.weight}</p>
      <p>Sets: {entry.sets}</p>
      <p>Reps: {entry.reps}</p>
      <p>RIR: {entry.rir ?? "Not recorded"}</p>

      {estimatedOneRepMax && (
      <p>Estimated 1RM: {estimatedOneRepMax} lb</p>
    )}

    {isEstimatedPr && (
      <div className="pr-badge-row">
        <span className="pr-badge"
        title="Estimated Personal Record"
        >
          <span className="pr-badge-text">PR</span>
        </span>
      </div>
    )}

    <button onClick={() => onUpdate(entry)}>
      Edit Entry
    </button>

    <button onClick={() => onDelete(entry.id)}>
      Delete Entry
    </button>
    </article>
  );
}

export default WorkoutEntryCard;