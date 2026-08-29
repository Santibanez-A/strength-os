import { findBestEntry } from "../utils/oneRepMax";
import { createTrainingGuidance } from "../utils/trainingGuidance";
import { useState } from "react";


function TrainingGuidance({ entries, exercises }) {

  const [selectedExerciseId, setSelectedExerciseId] = useState("");

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

const selectedGuidance = guidance.find(
  (item) =>
    String(item.exercise.id) === selectedExerciseId
  );

  return (
    <section>
      <h2>Training Guidance</h2>

      <select value={selectedExerciseId}
        onChange={(event) =>
        setSelectedExerciseId(event.target.value)
        }>

      <option value="">Select an exercise</option>

      {guidance
        .filter((item) => item.trainingWeights.length > 0)
        .map((item) => (
        <option
          key={item.exercise.id}
          value={item.exercise.id} >
          {item.exercise.name}
        </option>

        ))}
      </select>

      {selectedGuidance && (
      <article>
      <h3>{selectedGuidance.exercise.name}</h3>

      <p>
      Estimated 1RM: {selectedGuidance.estimatedMax} lb
      </p>
        
    <div className="training-percentages">
      {selectedGuidance.trainingWeights.map((trainingWeight) => (
      <div
      className="training-percentage"
      key={trainingWeight.percentage}
      >
      <span>{trainingWeight.percentage}%</span>
      <strong>{trainingWeight.weight} lb</strong>
      </div>
      ))}
    </div>
      </article>
    )}
    </section>
  );
}

export default TrainingGuidance;