import { NextRequest } from "next/server";
import prisma from "@/app/lib/prisma";

interface RequestBody {
  studentId: string;
}

/**
 * Converts a topic name to lowercase kebab case without symbols.
 * For example: "Lists, Queues, and Stacks" becomes "lists-queues-and-stacks".
 * @param {string} topicName
 * @returns {string} kebab-case version of the topic name.
 */
function convertToKebabCase(topicName: string): string {
  return topicName
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")  // Remove symbols and special characters
    .trim()
    .replace(/\s+/g, "-");  // Replace spaces with hyphens
}

export async function POST(request: NextRequest) {
  try {
    const body: RequestBody = await request.json();
    const studentId = body.studentId;

    if (!studentId) {
      return new Response(
        JSON.stringify({ data: null, status: 400 }),
        { status: 400 }
      );
    }

    const topicScores = await prisma.$queryRaw`
      WITH RankedScores AS (
        SELECT 
          BIN_TO_UUID(t.topicID) AS topicId,
          t.name AS topicName,
          w.weighted_performance_score AS score,
          ROW_NUMBER() OVER (
            PARTITION BY t.topicID 
            ORDER BY w.created_at DESC
          ) AS rn
        FROM weighted_topic_performance_log w
        JOIN questionTopic t ON w.topic_id = t.topicID
        WHERE w.student_id = UUID_TO_BIN(${studentId})
      )
      SELECT topicName, score, rn FROM RankedScores
      WHERE rn <= 10
      ORDER BY rn ASC
    `;

    // Process the scores into the desired output format
    const scoresByRank: Record<number, Record<string, number>> = {};
    const topics = new Set<string>();

    topicScores.forEach((score: any) => {
      const rank = score.rn;
      const kebabCaseTopicName = convertToKebabCase(score.topicName);
      topics.add(kebabCaseTopicName);

      // Initialize the rank entry if it does not exist
      if (!scoresByRank[rank]) {
        scoresByRank[rank] = {};
      }

      // Add the topic score to the rank object
      scoresByRank[rank][kebabCaseTopicName] = score.score;
    });

    // Convert the scoresByRank map to an array, sorted by rank
    const formattedScores = Object.keys(scoresByRank)
      .sort((a, b) => Number(a) - Number(b))
      .map(rank => scoresByRank[Number(rank)]);

    return new Response(
      JSON.stringify({ data: formattedScores, status: 200 }),
      { status: 200 }
    );

  } catch (error) {
    console.error("Failed to fetch performance trends:", error);
    return new Response(
      JSON.stringify({ data: null, status: 500 }),
      { status: 500 }
    );
  }
}
