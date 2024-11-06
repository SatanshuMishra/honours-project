import { readdir } from 'fs/promises';
import { join } from 'path';
import { NextResponse } from 'next/server';

export async function GET() {
	try {
		const dataDirectory = join(process.cwd(), 'app/data');
		const files = await readdir(dataDirectory);
		const tsFiles = files.filter(file => file.endsWith('.ts'));
		return NextResponse.json({ files: tsFiles });
	} catch (error) {
		console.log(error);
		return NextResponse.json(
			{ error: 'Failed to read directory' },
			{ status: 500 }
		);
	}
}
