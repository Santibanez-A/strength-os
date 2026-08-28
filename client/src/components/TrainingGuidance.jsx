import { findBestEntry } from "../utils/oneRepMax";
import { createTrainingGuidance } from "../utils/trainingGuidance";


function TrainingGuidance({ entries, exercises }) {
  const guidance = exercises.map((exercise) => {
    const exerciseEntries = entries.filter(
      (entry) => entry.exercise_id === exercise.id
    );

    const bestEntry = findBestEntry(exerciseEntries);

    const trainingWeights = bestEntry
  ? createTrainingGuidance(bestEntry.estimatedMax)
  : [];

  return {
  exercise: exercise,
  estimatedMax: bestEntry?.estimatedMax,
  trainingWeights: trainingWeights,
    };
});

  return (
    <section>
      <h2>Training Guidance</h2>

    {guidance
        .filter((item) => item.trainingWeights.length > 0)
        .map((item) => (
    <div key={item.exercise.id}>
      <h3>{item.exercise.name}</h3>

      <p>
        Estimated 1RM: {item.estimatedMax} lb
      </p>

      {item.trainingWeights.map((trainingWeight) => (
        <p key={trainingWeight.percentage}>
          {trainingWeight.percentage}%:{" "}
          {trainingWeight.weight} lb
        </p>
      ))}
    </div>
  ))}

    </section>
  );
}

export default TrainingGuidance;