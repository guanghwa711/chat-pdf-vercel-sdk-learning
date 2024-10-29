import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { exec } from "child_process";
import { STORAGE_CACHE_DIR, STORAGE_DIR } from "../chat/engine/constants.mjs";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const filePath = path.join(STORAGE_DIR, file.name);
    // Ensure the data directory exists
    if (!fs.existsSync(STORAGE_DIR)) {
      fs.mkdirSync(STORAGE_DIR, { recursive: true });
    }

    // Save the file to the data directory
    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(filePath, buffer);

    if (fs.existsSync(STORAGE_CACHE_DIR)) {
        const files = fs.readdirSync(STORAGE_CACHE_DIR);
        files.forEach(file => {
          const filePath = path.join(STORAGE_CACHE_DIR, file);
          fs.truncateSync(filePath, 0);
        });
    };
    // Run the generate script
    await runGenerateCommand();

    return NextResponse.json({ message: "File uploaded and processed successfully" });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

async function runGenerateCommand() {
    return new Promise((resolve, reject) => {
        exec("npm run generate", (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing generate script: ${stderr}`);
                return reject(new Response("Internal server error", { status: 500 }));
            }
            console.log(`Generate script output: ${stdout}`);
            resolve(true);
        });
    });
}