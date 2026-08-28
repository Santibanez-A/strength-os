export function calculateTrainingWeight(
  estimatedMax,
  percentage
) {
  return Math.round(estimatedMax * percentage);
}

export function createTrainingGuidance(estimatedMax) {
  const percentages = [
    0.6,
    0.7,
    0.75,
    0.8,
    0.85,
    0.9,
];

return percentages.map((percentage) => ({
  percentage: percentage * 100,
  weight: calculateTrainingWeight(
    estimatedMax,
    percentage
  ),
}));
}