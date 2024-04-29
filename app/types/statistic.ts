import Question from "./question";
import Student from "./student";

export default interface Statistic {
	statID?: string;
	studentID?: Student["studentID"];
	questionID?: Question["questionID"];
	chosenAnswerID?: string;
	isCorrect?: boolean;
	timeToAnswer?: number;
	createdAt?: Date;
}
