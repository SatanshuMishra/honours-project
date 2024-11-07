import prisma from "../../../lib/prisma";
import path from 'path';
import { promises as fs } from 'fs';
import { parse } from 'csv-parse/sync';

const CSV_PATH = path.join(process.cwd(), 'app', 'codes', 'studentCodes.csv');

interface CSVRow {
    code: string;
    [key: string]: string;
}

/**
 * Processes usernames from CSV data and checks for duplicates
 * @throws Error if duplicates or invalid data found
 */
function processCSVData(csvContent: string): string[] {
    const records = parse(csvContent, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
        skipRecordsWithError: false
    }) as CSVRow[];

    if (records.length > 0 && !('code' in records[0])) {
        throw new Error("CSV file must contain a 'code' column");
    }

    const codes = records.map((record, index) => {
        const code = record.code.trim();
        if (!code) {
            throw new Error(`Empty code found at row ${index + 2}`);
        }
        return code;
    });

    const seen = new Set<string>();
    const duplicates = new Set<string>();
    
    codes.forEach(code => {
        if (seen.has(code)) {
            duplicates.add(code);
        }
        seen.add(code);
    });
    
    if (duplicates.size > 0) {
        throw new Error(
            `Duplicate codes found in CSV file: ${Array.from(duplicates).join(', ')}`
        );
    }
    
    return codes;
}

/**
 * Handles POST request to bulk import codes from the CSV file
 */
export async function POST() {
    try {
        const content = await fs.readFile(CSV_PATH, 'utf-8');
        const processedCodes = processCSVData(content);
        
        if (processedCodes.length === 0) {
            return new Response(JSON.stringify({
                error: "Bad Request",
                message: "No valid codes found in CSV file",
                status: 400
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const placeholders = processedCodes.map(() => '?').join(',');
        const existingCodes = await prisma.$queryRawUnsafe<{ code: string }[]>(
            `SELECT code FROM studentCode WHERE code IN (${placeholders})`,
            ...processedCodes
        );

        if (existingCodes.length > 0) {
            return new Response(JSON.stringify({
                error: "Conflict",
                message: `Following codes already exist in database: ${existingCodes.map(e => e.code).join(', ')}`,
                status: 409
            }), {
                status: 409,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const insertPlaceholders = processedCodes.map(() => '(?)').join(',');
        const result = await prisma.$executeRawUnsafe(
            `INSERT INTO studentCode (code) VALUES ${insertPlaceholders}`,
            ...processedCodes
        );

        return new Response(JSON.stringify({
            data: {
                totalProcessed: processedCodes.length,
                inserted: result
            },
            status: 201
        }), {
            status: 201,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error: any) {
        console.error('Error in bulk code import:', error);
        
        if (error.message.includes('CSV')) {
            return new Response(JSON.stringify({
                error: "Invalid CSV",
                message: error.message,
                status: 400
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        if (error.code === 'ENOENT') {
            return new Response(JSON.stringify({
                error: "Not Found",
                message: "CSV file not found at expected location",
                status: 404
            }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        if (error.message.includes('Duplicate codes found')) {
            return new Response(JSON.stringify({
                error: "Bad Request",
                message: error.message,
                status: 400
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        return new Response(JSON.stringify({
            error: "Internal Server Error",
            message: error.message,
            status: 500
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
