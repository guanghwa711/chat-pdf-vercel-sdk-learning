import { NextResponse } from "next/server";
import fs from "fs";

const FILES_JSON_PATH = './public/files.json';

export async function GET() {
  try {
    const data = fs.readFileSync(FILES_JSON_PATH, 'utf-8');
    const files = JSON.parse(data);
    return NextResponse.json({ files });
  } catch (error) {
    console.error("Error reading files:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}