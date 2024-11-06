import { POST } from "@/app/user-auth/api/register/route";
import { NextRequest } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { afterAll, beforeAll, describe } from "@jest/globals";

const exampleUser = {
	name: "Test User",
	username: "TestUser",
	password: "TestUser@12345#",
};

describe("Registration API Route", () => {
	// CHECK TO REMOVE TEST USER BEFORE EACH TEST
	beforeAll(async () => {
		await prisma
			.$executeRaw`INSERT INTO studentCode (code, isRegistered) VALUES ("TestUser", 0)`;
	});

	it("create new test user", async () => {
		const req = new NextRequest(
			"http:localhost:3000/user-auth/api/register",
			{
				method: "POST",
				body: JSON.stringify(exampleUser),
			},
		);

		const response = await POST(req);
		expect(response.status).toBe(201);

		const jsonResponse = await response.json();
		expect(jsonResponse.message).toContain("was signed-up successfully.");
	});

	it("attempt registration with existing username", async () => {
		const req = new NextRequest(
			"http:localhost:3000/user-auth/api/register",
			{
				method: "POST",
				body: JSON.stringify(exampleUser),
			},
		);

		const response = await POST(req);
		expect(response.status).toBe(500);

		const jsonResponse = await response.json();
		expect(jsonResponse.message).toContain("Student code is already in use!");
	});

	afterAll(async () => {
		await prisma
			.$executeRaw`DELETE FROM student WHERE username = "TestUser"`;

		await prisma
			.$executeRaw`DELETE FROM studentCode WHERE code = "TestUser"`;
	});
});
