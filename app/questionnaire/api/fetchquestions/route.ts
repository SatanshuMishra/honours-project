import Question from "@/app/types/question";
import prisma from "../../../lib/prisma";
import { NextRequest } from "next/server";
import { v4 as uuidv4 } from "uuid";

/**
 * Validates Student Knowledge. If a student doesn't have student knowledge entries, then it adds default entries
 */
async function validateStudentKnowledge(studentID: string, topicID: string) {
    try {
        const entries: { hasEntries: string }[] = await prisma.$queryRaw`
            SELECT IF(COUNT(*) = 6, true, false) AS hasEntries
            FROM studentKnowledge
            WHERE studentID = UUID_TO_BIN(${studentID})
            AND topicID = UUID_TO_BIN(${topicID})
        `;

        if (entries.length !== 1) {
            throw new Error("Entries returned no or more than 1 row.");
        }

        if (entries[0].hasEntries == "1") return true;

        await prisma.$queryRaw`
            INSERT INTO studentKnowledge (knowledgeID, studentID, topicID, categoryID, mastery, scaledDifficulty, idealDifficulty)
            SELECT UUID_TO_BIN(UUID()), UUID_TO_BIN(${studentID}), UUID_TO_BIN(${topicID}), categoryID, 0.5, 0.0, 3
            FROM taxonomyCategory
            WHERE NOT EXISTS (
                SELECT 1
                FROM studentKnowledge sk
                WHERE sk.studentID = UUID_TO_BIN(${studentID})
                AND sk.topicID = UUID_TO_BIN(${topicID})
                AND sk.categoryID = taxonomyCategory.categoryID
            )
        `;

        return true;
    } catch (e) {
        console.error(e);
        return false;
    }
}

/**
 * Updates the question attempt history for a student
 */
async function updateQuestionAttemptHistory(studentID: string, questionIDs: string[]) {
    try {
        for (const questionID of questionIDs) {
            const historyID = uuidv4();
            await prisma.$queryRawUnsafe(
                `INSERT INTO question_attempt_history (historyID, studentID, questionID)
                 VALUES (UUID_TO_BIN(?), UUID_TO_BIN(?), UUID_TO_BIN(?))
                 ON DUPLICATE KEY UPDATE lastAttempted = CURRENT_TIMESTAMP`,
                historyID,
                studentID,
                questionID
            );
        }
    } catch (error) {
        console.error('Error updating question attempt history:', error);
        throw error;
    }
}

export async function POST(request: NextRequest) {
    try {
        const requestText = await request.text();
        const requestBody: {
            studentID: string;
            topicID: string;
        } = JSON.parse(requestText);

        const numberOfQuestions = parseInt(process.env.NEXT_PUBLIC_NUMBER_OF_QUESTIONS);

        const validated = await validateStudentKnowledge(
            requestBody.studentID,
            requestBody.topicID
        );

        if (!validated) {
            return new Response(JSON.stringify({
                data: null,
                status: 404,
                message: "Validation Failed",
                pgErrorObject: null,
            }));
        }

        let questions: {
            questionID: Question["questionID"];
            modifiedDifficulty: Question["modifiedDifficulty"];
            question: Question["question"];
            code: Question["code"];
        }[] = await prisma.$queryRawUnsafe(`
            WITH RankedQuestions AS (
                SELECT 
                    q.questionID,
                    q.modifiedDifficulty,
                    q.question,
                    q.code,
                    CASE WHEN qah.questionID IS NULL THEN 0 ELSE 1 END as was_attempted,
                    ROW_NUMBER() OVER (
                        PARTITION BY CASE WHEN qah.questionID IS NULL THEN 0 ELSE 1 END 
                        ORDER BY RAND()
                    ) as rank_in_group
                FROM question q 
                JOIN studentKnowledge sk 
                    ON q.topicID = sk.topicID 
                    AND q.categoryID = sk.categoryID
                LEFT JOIN question_attempt_history qah 
                    ON q.questionID = qah.questionID 
                    AND qah.studentID = UUID_TO_BIN(?)
                WHERE 
                    q.topicID = UUID_TO_BIN(?)
                    AND sk.studentID = UUID_TO_BIN(?)
                    AND q.modifiedDifficulty BETWEEN sk.idealDifficulty - 1 AND sk.idealDifficulty + 1
                    AND q.isHidden = FALSE
            )
            SELECT 
                BIN_TO_UUID(questionID) as questionID,
                modifiedDifficulty,
                question,
                code
            FROM RankedQuestions
            WHERE 
                (was_attempted = 0 AND rank_in_group <= ${numberOfQuestions})
                OR (was_attempted = 1 AND rank_in_group <= ${numberOfQuestions} AND 
                    (SELECT COUNT(*) FROM RankedQuestions WHERE was_attempted = 0) < ${numberOfQuestions})
            ORDER BY was_attempted, RAND()
            LIMIT ${numberOfQuestions}`,
            requestBody.studentID,
            requestBody.topicID,
            requestBody.studentID
        );

        if (questions.length < numberOfQuestions) {
            let bracket = 1;
            const maxBracket = 2;

            while (questions.length < numberOfQuestions && bracket <= maxBracket) {
                bracket += 1;
                questions = await prisma.$queryRawUnsafe(`
                    WITH RankedQuestions AS (
                        SELECT 
                            q.questionID,
                            q.modifiedDifficulty,
                            q.question,
                            q.code,
                            CASE WHEN qah.questionID IS NULL THEN 0 ELSE 1 END as was_attempted,
                            ROW_NUMBER() OVER (
                                PARTITION BY CASE WHEN qah.questionID IS NULL THEN 0 ELSE 1 END 
                                ORDER BY RAND()
                            ) as rank_in_group
                        FROM question q 
                        JOIN studentKnowledge sk 
                            ON q.topicID = sk.topicID 
                            AND q.categoryID = sk.categoryID
                        LEFT JOIN question_attempt_history qah 
                            ON q.questionID = qah.questionID 
                            AND qah.studentID = UUID_TO_BIN(?)
                        WHERE 
                            q.topicID = UUID_TO_BIN(?)
                            AND sk.studentID = UUID_TO_BIN(?)
                            AND q.modifiedDifficulty BETWEEN sk.idealDifficulty - ${bracket} AND sk.idealDifficulty + ${bracket}
                            AND q.isHidden = FALSE
                    )
                    SELECT 
                        BIN_TO_UUID(questionID) as questionID,
                        modifiedDifficulty,
                        question,
                        code
                    FROM RankedQuestions
                    WHERE 
                        (was_attempted = 0 AND rank_in_group <= ${numberOfQuestions})
                        OR (was_attempted = 1 AND rank_in_group <= ${numberOfQuestions} AND 
                            (SELECT COUNT(*) FROM RankedQuestions WHERE was_attempted = 0) < ${numberOfQuestions})
                    ORDER BY was_attempted, RAND()
                    LIMIT ${numberOfQuestions}`,
                    requestBody.studentID,
                    requestBody.topicID,
                    requestBody.studentID
                );
            }

            if (questions.length < numberOfQuestions) {
                return new Response(JSON.stringify({
                    data: null,
                    status: 404,
                    message: "Maximum bracket reached. Not enough questions exist for this topic.",
                    pgErrorObject: null,
                }));
            }
        }

        // Update attempt history for selected questions
        await updateQuestionAttemptHistory(
            requestBody.studentID, 
            questions.map(q => q.questionID)
        );

        return new Response(JSON.stringify({
            data: questions,
            status: 200,
            message: "Questions successfully returned.",
            pgErrorObject: null,
        }));
    } catch (e) {
        console.error(e);
        return new Response(JSON.stringify({
            data: null,
            status: 400,
            message: "Something went wrong with fetching questions.",
            pgErrorObject: e,
        }));
    }
}
