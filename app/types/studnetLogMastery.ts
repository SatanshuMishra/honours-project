import QuestionTopic from "./questionTopic";
import Student from "./student";
import StudentKnowledge from "./studentKnowledge";
import TaxonomyCategory from "./taxonomyCategory";

export default interface StudentLogOffset{
	studentLogID: string;
	studentID: Student["studentID"];
	topicID: QuestionTopic["topicID"];
	categoryID: TaxonomyCategory["categoryID"];
	mastery: StudentKnowledge["difficultyOffset"];
	createdAt: Date;
}
