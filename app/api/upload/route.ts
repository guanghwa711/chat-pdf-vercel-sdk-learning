import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { exec } from "child_process";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const dataDir = path.join(process.cwd(), "data");
    const cacheDir = path.join(process.cwd(), "cache");
    const filePath = path.join(dataDir, file.name);

    // Ensure the data directory exists
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Save the file to the data directory
    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(filePath, buffer);

    if (fs.existsSync(cacheDir)) {
        const files = fs.readdirSync(cacheDir);
        files.forEach(file => {
          const filePath = path.join(cacheDir, file);
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