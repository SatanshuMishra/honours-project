import QuestionTopic from "./questionTopic";
import TaxonomyCategory from "./taxonomyCategory";

export default interface Question {
	questionID?: string;
	topicID?: QuestionTopic["topicID"];
	assignedDifficulty?: string;
	modifiedDifficulty?: string;
	categoryID?: TaxonomyCategory["categoryID"];
	assignedCompletionTime?: string;
	modifiedCompletionTime?: string;
	question?: string;
	code?: string;
}
