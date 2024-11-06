import prisma from "../../../lib/prisma";
import { NextRequest } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

// Define schema for request body validation
const requestBodySchema = z.object({
    questionID: z.string().uuid(),
    answer: z.string().min(1, "Answer cannot be empty"),
    explanation: z.string().min(1, "Explanation cannot be empty"),
    isCorrect: z.boolean(),
});

// Custom error for not found cases
class NotFoundError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "NotFoundError";
    }
}

/**
 * Verifies that the question exists before adding an answer
 * @param questionID UUID of the question
 * @throws NotFoundError if question doesn't exist
 */
async function verifyQuestion(questionID: string): Promise<void> {
    const question = await prisma.$queryRawUnsafe<{ questionID: string }[]>(
        `SELECT BIN_TO_UUID(questionID) as questionID FROM question WHERE questionID = UUID_TO_BIN(?)`,
        questionID
    );
    if (question.length === 0) {
        throw new NotFoundError(`Question with ID ${questionID} not found`);
    }
}

/**
 * Handles POST request to insert a new answer for a question
 * @param request HTTP request
 * @returns HTTP response with answer ID and status
 */
export async function POST(request: NextRequest) {
    try {
        const requestText = await request.text();
        const requestBody = requestBodySchema.parse(JSON.parse(requestText));

        // Verify question exists before adding answer
        await verifyQuestion(requestBody.questionID);

        const answerID = uuidv4();

        await prisma.$queryRawUnsafe(
            `INSERT INTO answer (
                answerID, 
                questionID, 
                answerDescription, 
                answerExplanation, 
                isCorrect
            )
            VALUES (
                UUID_TO_BIN(?), 
                UUID_TO_BIN(?), 
                ?, 
                ?, 
                ?
            )`,
            answerID,
            requestBody.questionID,
            requestBody.answer,
            requestBody.explanation,
            requestBody.isCorrect
        );

        return new Response(
            JSON.stringify({
                data: { 
                    answerID,
                    message: 'Answer created successfully' 
                },
                status: 201
            }),
            { 
                status: 201,
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
    } catch (error) {
        console.error('Error inserting answer:', error);
        
        let statusCode = 500;
        let errorMessage = 'Internal server error';
        
        if (error instanceof z.ZodError) {
            statusCode = 400;
            errorMessage = error.errors.map(e => e.message).join(', ');
        } else if (error instanceof NotFoundError) {
            statusCode = 404;
            errorMessage = error.message;
        } else if (error instanceof Error) {
            errorMessage = error.message;
        }

        return new Response(
            JSON.stringify({
                error: errorMessage,
                status: statusCode
            }),
            { 
                status: statusCode,
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
    }
}