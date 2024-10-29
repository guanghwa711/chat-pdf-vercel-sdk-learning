import { NextResponse } from "next/server";
import fs from "fs";
import { STORAGE_DIR } from "../chat/engine/constants.mjs";

export async function GET() {
  try {
    if (!fs.existsSync(STORAGE_DIR)) {
      return NextResponse.json({ files: [], STORAGE_DIR });
    }

    const files = fs.readdirSync(STORAGE_DIR).filter((file) => file.endsWith(".pdf"));
    return NextResponse.json({ files });
  } catch (error) {
    console.error("Error reading files:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}