// Type definition for each question in the recursion data
interface QuestionData {
    topic: string;
    bloomTaxonomyCategory: string;
    difficulty: number;
    question: string;
    code?: string;
    answersList: string[];
    correctAnswerIndex: number;
    explanationsList: string[];
}

interface StudentInfo {
    studentID: string;
    name: string;
    username: string;
}

const isValidQuestionData = (el: any): el is QuestionData => {
    const requiredFields: (keyof QuestionData)[] = [
        "topic",
        "bloomTaxonomyCategory",
        "difficulty",
        "question",
        "answersList",
        "correctAnswerIndex",
        "explanationsList",
    ];

    for (const field of requiredFields) {
        if (!(field in el)) {
            console.error(`Missing required field: ${field}`);
            return false;
        }
    }

    if (!Array.isArray(el.answersList) || el.answersList.length === 0) {
        console.error("Invalid or empty answersList.");
        return false;
    }
    if (!Array.isArray(el.explanationsList) || el.explanationsList.length !== el.answersList.length) {
        console.error("explanationsList length must match answersList length.");
        return false;
    }
    if (typeof el.correctAnswerIndex !== "number" || el.correctAnswerIndex < 0 || el.correctAnswerIndex >= el.answersList.length) {
        console.error("Invalid correctAnswerIndex.");
        return false;
    }

    return true;
};

async function insertQuestion(
    studentID: string,
    topic: string,
    assignedDifficulty: number,
    question: string,
    bloomTaxonomy: string,
    code?: string
): Promise<string> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const values = {
        studentID,
        topic,
        assignedDifficulty,
        question,
        taxonomyCategory: bloomTaxonomy,
        code: code || null
    };

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

        const response = await fetch(`${baseUrl}/questionnaire/api/addquestion`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
            cache: "no-cache",
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Server error: ${response.status}`);
        }

        const result = await response.json();

        if (!result?.data?.questionID) {
            throw new Error("No question ID returned from server");
        }

        console.log("Question inserted successfully:", result.data.questionID);
        return result.data.questionID;

    } catch (error) {
        if (error instanceof Error) {
            if (error.name === 'AbortError') {
                throw new Error('Request timeout: Failed to insert question within 10 seconds');
            }
            console.error("Error inserting question:", error.message);
            throw error;
        }
        throw new Error('Unknown error occurred while inserting question');
    }
}

async function insertAnswer(
    questionID: string,
    answer: string,
    explanation: string,
    isCorrect: boolean
): Promise<string> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const values = {
        questionID,
        answer,
        explanation,
        isCorrect
    };

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

        const response = await fetch(`${baseUrl}/questionnaire/api/addanswer`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
            cache: "no-cache",
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || `Server error: ${response.status}`);
        }

        if (!result?.data?.answerID) {
            throw new Error("No answer ID returned from server");
        }

        console.log("Answer inserted successfully:", result.data.answerID);
        return result.data.answerID;

    } catch (error) {
        if (error instanceof Error) {
            if (error.name === 'AbortError') {
                throw new Error('Request timeout: Failed to insert answer within 10 seconds');
            }
            console.error("Error inserting answer:", error.message);
            throw error;
        }
        throw new Error('Unknown error occurred while inserting answer');
    }
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function retryOperation<T>(
    operation: () => Promise<T>,
    retries: number = 3,
    delayMs: number = 1000
): Promise<T> {
    let lastError: Error | undefined;

    for (let i = 0; i < retries; i++) {
        try {
            return await operation();
        } catch (error) {
            lastError = error instanceof Error ? error : new Error('Unknown error');
            console.error(`Attempt ${i + 1} failed:`, lastError.message);
            if (i < retries - 1) {
                await delay(delayMs * Math.pow(2, i)); // Exponential backoff
            }
        }
    }

    throw lastError || new Error('Operation failed after retries');
}

export default async function parseJSON(questionSet: QuestionData[], studentInfo: string) {
    try {
        const student: StudentInfo = JSON.parse(studentInfo);

        if (!student.studentID) {
            throw new Error('No student ID found in info');
        }

        console.log("Processing questions for student:", student);

        // Process questions sequentially
        for (const el of questionSet) {
            try {
                if (!isValidQuestionData(el)) {
                    console.error("Invalid question format, skipping question:", el);
                    continue;
                }

                // Insert question with retry logic
                const questionID = await retryOperation(async () => {
                    return await insertQuestion(
                        student.studentID,
                        el.topic,
                        el.difficulty,
                        el.question,
                        el.bloomTaxonomyCategory,
                        el.code
                    );
                });

                if (questionID) {
                    console.log(`Processing answers for question ${questionID}`);
                    
                    // Process answers sequentially
                    for (let idx = 0; idx < el.answersList.length; idx++) {
                        try {
                            // Insert answer with retry logic
                            await retryOperation(async () => {
                                return await insertAnswer(
                                    questionID,
                                    el.answersList[idx],
                                    el.explanationsList[idx],
                                    idx === el.correctAnswerIndex
                                );
                            });
                            
                            console.log(`Answer ${idx + 1} inserted successfully for question ${questionID}`);
                        } catch (error) {
                            console.error(`Failed to insert answer ${idx + 1} for question ${questionID} after all retries:`, error);
                        }
                    }
                }
            } catch (error) {
                console.error("Error processing question:", error);
            }
        }
    } catch (error) {
        console.error('Error parsing student info:', error);
        throw error;
    }
}
