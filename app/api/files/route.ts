import { NextResponse } from "next/server";
import fs from "fs";

export async function GET() {
  try {
    const dataDir = "./data";
    if (!fs.existsSync(dataDir)) {
      return NextResponse.json({ files: [], dataDir });
    }

    const files = fs.readdirSync(dataDir).filter((file) => file.endsWith(".pdf"));
    return NextResponse.json({ files });
  } catch (error) {
    console.error("Error reading files:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}