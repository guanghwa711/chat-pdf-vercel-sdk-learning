import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function DELETE() {
  try {
    const cacheDir = path.join(process.cwd(), "cache");

    if (fs.existsSync(cacheDir)) {
      const files = fs.readdirSync(cacheDir);
      files.forEach(file => {
        const filePath = path.join(cacheDir, file);
        fs.truncateSync(filePath, 0);
      });
    }

    return NextResponse.json({ message: "Cache contents deleted successfully" });
  } catch (error) {
    console.error("Error deleting cache contents:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 