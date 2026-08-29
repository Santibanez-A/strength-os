import { findBestEntry } from "../utils/oneRepMax";

function PersonalRecords({ entries, exercises }) {

    const personalRecords = exercises.map((exercise) => {
    const exerciseEntries = entries.filter(
    (entry) => entry.exercise_id === exercise.id);

    const bestEntry = findBestEntry(exerciseEntries);

    return {
    exercise: exercise,
    entry: bestEntry?.entry,
    estimatedMax: bestEntry?.estimatedMax,};
});



return (
  <section>
    <h2>Personal Records</h2>

    <div className="personal-records-grid">
      {personalRecords
        .filter((record) => record.entry)
        .map((record) => (
          <article key={record.exercise.id}>
            <h3>{record.exercise.name}</h3>

            <p>
              Estimated 1RM: {record.estimatedMax} lb
            </p>

            <p>
              {record.entry.weight} lb × {record.entry.reps} reps
            </p>
          </article>
        ))}
    </div>
  </section>
);
}

export default PersonalRecords;