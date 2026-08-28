import { calculateOneRepMax } from "../utils/oneRepMax";

function PersonalRecords({ entries, exercises }) {

    const personalRecords = exercises.map((exercise) => {
    const exerciseEntries = entries.filter(
    (entry) => entry.exercise_id === exercise.id);

    const entriesWithMax = exerciseEntries.map((entry) => ({
    entry: entry,
    estimatedMax: calculateOneRepMax(
    entry.weight,
    entry.reps),
    }));

    const bestEntry = entriesWithMax.reduce(
    (best, current) => {
    if (
      !best ||
      current.estimatedMax > best.estimatedMax
    ) {
      return current;
    }

        return best;
    },
    null
    );

    return {
    exercise: exercise,
    entry: bestEntry?.entry,
    estimatedMax: bestEntry?.estimatedMax,};
});



return (
  <section>
    <h2>Personal Records</h2>

    {personalRecords
      .filter((record) => record.entry)
      .map((record) => (
        <div key={record.exercise.id}>
          <h3>{record.exercise.name}</h3>

          <p>
            Estimated 1RM: {record.estimatedMax} lb
          </p>

          <p>
            {record.entry.weight} lb × {record.entry.reps} reps
          </p>
        </div>
      ))}
  </section>
);
}

export default PersonalRecords;