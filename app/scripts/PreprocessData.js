export const preprocessData = (data, stats) => {
  return data.map((item) => {
    return [
      item.previousProgrammingExperience / 5,
      item.difficulty / 3,
      item.isCorrect ? 1 : 0,
      item.timeToAnswer / stats.maxTime,
      item.recordedDifficulty / 3,
    ];
  });
};
