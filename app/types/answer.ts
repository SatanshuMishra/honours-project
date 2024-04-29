import Question from "./question";

export default interface Answer {
  answerID?: string;
  questionID?: Question["questionID"];
  answerDescription?: string;
  answerExplanation?: string;
  isCorrect?: boolean;
}
