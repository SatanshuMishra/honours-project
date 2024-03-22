export default interface Statistic {
	statID?: string;
	studentID?: string;
	questionID?: string;
	chosenAnswerID?: string;
	isCorrect?: boolean;
	timeToAnswer?: number;
	createdAt?: Date;
}
