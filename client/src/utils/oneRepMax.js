export function calculateOneRepMax(weight, reps) {
  const liftedWeight = Number(weight);
  const repetitions = Number(reps);

  if (
  liftedWeight <= 0 ||
  repetitions <= 0 ||
  repetitions > 20
  ) {
  return null;
  }

  if (repetitions === 1) {
    return liftedWeight;
  }

  const brzycki =
  liftedWeight * (36 / (37 - repetitions));

const epley =
  liftedWeight * (1 + 0.0333 * repetitions);

const lander =
  (100 * liftedWeight) /
  (101.3 - 2.67123 * repetitions);

const lombardi =
  liftedWeight * Math.pow(repetitions, 0.1);

const mayhew =
  (100 * liftedWeight) /
  (52.2 + 41.9 * Math.exp(-0.055 * repetitions));

const oconner =
  liftedWeight * (1 + 0.025 * repetitions);

const wathan =
  (100 * liftedWeight) /
  (48.8 + 53.8 * Math.exp(-0.075 * repetitions));

  const average =
  (
    brzycki +
    epley +
    lander +
    lombardi +
    mayhew +
    oconner +
    wathan
  ) / 7;
  return Math.round(average);
}
  
export function findBestEntry(entries) {
const entriesWithMax = entries
  .map((entry) => ({
    entry: entry,
    estimatedMax: calculateOneRepMax(
      entry.weight,
      entry.reps
    ),
  }))
  .filter((item) => item.estimatedMax !== null);

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

  return bestEntry;
}
