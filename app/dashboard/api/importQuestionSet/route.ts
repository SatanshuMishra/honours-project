import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import parseJSON from '@/app/scripts/parseJSON';
import vm from 'vm';

type QuestionSet = {
	topic: string;
	bloomTaxonomyCategory: string;
	difficulty: number;
	question: string;
	code?: string;
	answersList: string[];
	correctAnswerIndex: number;
	explanationsList: string[];
};

export async function POST(request: NextRequest) {
	try {
		const { filename, studentInfo } = await request.json();
		const filePath = join(process.cwd(), 'app/data', filename);
		const fileContent = await readFile(filePath, 'utf-8');
		const matches = fileContent.match(/=\s*(\[[\s\S]*\])/);
		if (!matches || !matches[1]) {
			throw new Error('Could not find array in file content');
		}
		const arrayContent = matches[1].trim();
		const sandbox = {};
		const script = new vm.Script(`result = ${arrayContent}`);
		const context = vm.createContext(sandbox);
		script.runInContext(context);
		const questionSet = (sandbox as any).result as QuestionSet[];
		if (!Array.isArray(questionSet)) {
			throw new Error('Invalid question set format: not an array');
		}
		console.log(`QSet: ${questionSet}\nStudentInfo: ${studentInfo}`);
		parseJSON(questionSet, studentInfo);
		return NextResponse.json({ success: true });
	} catch (error) {
		console.error('Import error:', error);
		return NextResponse.json(
			{ error: error instanceof Error ? error.message : 'Failed to import question set' },
			{ status: 500 }
		);
	}
}
