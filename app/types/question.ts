export default interface Question {
	questionID: string;
	topicID?: string;
	assignedDifficulty?: number;
	modifiedDifficulty?: number;
	categoryID?: string;
	assignedCompletionTime?: number;
	modifiedCompletionTime?: number;
	question: string;
	code?: string;
}
