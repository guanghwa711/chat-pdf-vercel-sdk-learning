import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const dataDir = path.join(process.cwd(), "data");
    console.log(dataDir, "dataDir");
    if (!fs.existsSync(dataDir)) {
      return NextResponse.json({ files: [] });
    }

    const files = fs.readdirSync(dataDir).filter((file) => file.endsWith(".pdf"));
    return NextResponse.json({ files });
  } catch (error) {
    console.error("Error reading files:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}