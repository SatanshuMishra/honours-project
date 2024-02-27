import prisma from "../../../lib/prisma";
import StatData from "@/app/types/StatData";

async function addFetchUUIDMapping(uuid: any) {
  let mapping: any[] =
    await prisma.$queryRaw`SELECT * FROM uuidMapping WHERE uuid = ${uuid}`;

  if (!mapping || mapping.length === 0) {
    await prisma.$queryRaw`INSERT INTO uuidMapping (uuid) VALUES (${uuid})`;
    mapping =
      await prisma.$queryRaw`SELECT * FROM uuidMapping WHERE uuid = ${uuid}`;
  }

  console.log("MAPOUT: ", mapping);
  return mapping[0].id;
}

let matrix: any = {};

export async function POST() {
  try {
    let statistics: StatData[] =
      await prisma.$queryRaw`WITH student_questions AS (
  SELECT s.studentID, q.questionID
  FROM student s
  CROSS JOIN question q
)
SELECT sq.studentID, sq.questionID,
       COALESCE(
         AVG(s.isCorrect * EXP(0.5 * DATEDIFF(CURRENT_TIMESTAMP, s.createdAt))),
         FALSE
       ) AS isCorrect,
       COALESCE(
         AVG(s.timeToAnswer * EXP(0.5 * DATEDIFF(CURRENT_TIMESTAMP, s.createdAt))),
         0
       ) AS timeTaken,
		COUNT(DISTINCT s.statID) AS attemptCount
FROM student_questions sq
LEFT JOIN statistic s ON s.studentID = sq.studentID AND s.questionID = sq.questionID
GROUP BY sq.studentID, sq.questionID
ORDER BY sq.studentID, sq.questionID;
`;
    // MAP UUID TO INTEGER VALUES
    for (let i = 0; i < statistics.length; i++) {
      statistics[i].studentID = await addFetchUUIDMapping(
        statistics[i].studentID,
      );
      statistics[i].questionID = await addFetchUUIDMapping(
        statistics[i].questionID,
      );
    }
    // NORMALIZE TIME
    const timeValues = statistics.map((item) => item.timeTaken);
    const maxTime = Math.max(...timeValues);
    const minTime = Math.min(...timeValues);

    statistics.forEach((item) => {
      item.timeTaken = (item.timeTaken - minTime) / (maxTime - minTime);
    });

    const attemptValues = statistics.map((item) => Number(item.attemptCount));
    const maxTimeA = Math.max(...attemptValues);
    const minTimeA = Math.min(...attemptValues);

    statistics.forEach((item) => {
      item.attemptCount =
        (Number(item.attemptCount) - minTimeA) / (maxTimeA - minTimeA);
    });

    for (let i = 0; i < statistics.length; i++) {
      if (!matrix[statistics[i].studentID]) {
        matrix[statistics[i].studentID] = {}; // Initialize it if it doesn't exist
      }

      if (!matrix[statistics[i].studentID][statistics[i].questionID]) {
        matrix[statistics[i].studentID][statistics[i].questionID] = {}; // Initialize it if it doesn't exist
      }
      matrix[statistics[i].studentID][statistics[i].questionID] = [
        statistics[i].isCorrect,
        statistics[i].timeTaken,
        statistics[i].attemptCount,
      ];
    }

    return new Response(
      JSON.stringify({
        data: matrix,
        status: 200,
      }),
    );
  } catch (e) {
    console.log(e);
    return new Response(
      JSON.stringify({
        data: null,
        status: 400,
      }),
    );
  }
}
