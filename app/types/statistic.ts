export default interface Statistic {
  statID: any;
  studentID: any;
  questionID: any;
  chosenAnswerID: any;
  isCorrect: boolean;
  timeToAnswer: number;
  recordedDifficulty: number | null;
}
