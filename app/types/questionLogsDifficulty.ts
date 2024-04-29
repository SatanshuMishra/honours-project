import Question from "./question";

export default interface QuestionLogDifficulty{
	questionLogID: string;
	questionID: Question["questionID"];
	difficulty: Question["modifiedDifficulty"]
	createdAt: Date;
}
