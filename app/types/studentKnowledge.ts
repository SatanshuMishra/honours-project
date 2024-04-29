import QuestionTopic from "./questionTopic";
import Student from "./student";
import TaxonomyCategory from "./taxonomyCategory";

export default interface StudentKnowledge {
	knowledgeID?: string;
	studentID?: Student["studentID"];
	topicID?: QuestionTopic["topicID"];
	categoryID?: TaxonomyCategory["categoryID"];
	mastery?: number;
	difficultyOffset?: number;
}
