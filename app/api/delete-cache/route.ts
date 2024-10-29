import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { STORAGE_CACHE_DIR } from "../chat/engine/constants.mjs";

export async function DELETE() {
  try {
    if (fs.existsSync(STORAGE_CACHE_DIR)) {
      const files = fs.readdirSync(STORAGE_CACHE_DIR);
      files.forEach(file => {
        const filePath = path.join(STORAGE_CACHE_DIR, file);
        fs.truncateSync(filePath, 0);
      });
    }

    return NextResponse.json({ message: "Cache contents deleted successfully" });
  } catch (error) {
    console.error("Error deleting cache contents:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 