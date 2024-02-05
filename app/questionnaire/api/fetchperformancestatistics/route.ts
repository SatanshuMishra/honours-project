import prisma from "../../../lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import Statistic from "@/app/types/statistic";
import { PrismaClient } from "@prisma/client";
const prism = new PrismaClient();

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

export async function POST() {
	try {
		let statistics: Statistic[] =
			await prisma.$queryRaw`SELECT * FROM statistic`;
		let updatedStatistics = [];
		console.log(
			"DEMO: ",
			statistics[0].statID
				.map((code) => String.fromCharCode(code))
				.join("")
		);

		// MAP UUID TO INTEGER VALUES
		for (let i = 0; i < statistics.length; i++) {
			let statID = statistics[i].statID
				.map((code) => String.fromCharCode(code))
				.join("");
			let studentID = statistics[i].studentID
				.map((code) => String.fromCharCode(code))
				.join("");
			let questionID = statistics[i].questionID
				.map((code) => String.fromCharCode(code))
				.join("");
			let chosenAnswerID = statistics[i].chosenAnswerID
				.map((code) => String.fromCharCode(code))
				.join("");

			statistics[i].statID = await addFetchUUIDMapping(statID);
			statistics[i].studentID = await addFetchUUIDMapping(studentID);
			statistics[i].questionID = await addFetchUUIDMapping(questionID);
			statistics[i].chosenAnswerID =
				await addFetchUUIDMapping(chosenAnswerID);
		}

		// NORMALIZE TIME
		const timeValues = statistics.map((item) => item.timeToAnswer);
		const maxTime = Math.max(...timeValues);
		const minTime = Math.min(...timeValues);

		statistics.forEach((item) => {
			item.timeToAnswer =
				(item.timeToAnswer - minTime) / (maxTime - minTime);
		});

		return new Response(
			JSON.stringify({
				data: statistics,
				status: 200,
			})
		);
	} catch (e) {
		console.log(e);
		return new Response(
			JSON.stringify({
				data: null,
				status: 400,
			})
		);
	}
}
