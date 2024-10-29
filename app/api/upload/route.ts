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
    const filePath = path.join(dataDir, file.name);

    // Ensure the data directory exists
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Save the file to the data directory
    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(filePath, buffer);

    // Run the generate script
    exec("npm run generate", (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing generate script: ${stderr}`);
        return;
      }
      console.log(`Generate script output: ${stdout}`);
    });

    return NextResponse.json({ message: "File uploaded and processed successfully" });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}