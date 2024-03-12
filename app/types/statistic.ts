export default interface Statistic {
	statID: string;
	studentID?: string;
	questionID?: string;
	chosenAnswerID?: string;
	isCorrect: boolean;
	timeToAnswer?: number;
	recordedDifficulty?: number | null;
	createdAt?: Date;
}
