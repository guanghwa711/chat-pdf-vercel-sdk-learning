import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { exec } from "child_process";
import { STORAGE_CACHE_DIR, STORAGE_DIR } from "../chat/engine/constants.mjs";

const FILES_JSON_PATH = './public/files.json';

// Function to initialize the files.json if it doesn't exist or is empty
function initializeFilesJson() {
  if (!fs.existsSync(FILES_JSON_PATH) || fs.readFileSync(FILES_JSON_PATH, 'utf-8').trim() === '') {
    fs.writeFileSync(FILES_JSON_PATH, JSON.stringify([], null, 2)); // Create an empty array
  }
}

export async function POST(request: NextRequest) {
  try {
    // Initialize the files.json
    initializeFilesJson();

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const filePath = path.join(STORAGE_DIR, file.name);
    if (!fs.existsSync(STORAGE_DIR)) {
      fs.mkdirSync(STORAGE_DIR, { recursive: true });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(filePath, buffer);

    // Update the files.json
    await updateFilesJson(file.name);

    if (fs.existsSync(STORAGE_CACHE_DIR)) {
      const files = fs.readdirSync(STORAGE_CACHE_DIR);
      files.forEach(file => {
        const filePath = path.join(STORAGE_CACHE_DIR, file);
        fs.truncateSync(filePath, 0);
      });
    }

    await runGenerateCommand();

    return NextResponse.json({ message: "File uploaded and processed successfully" });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

async function updateFilesJson(fileName: string) {
  let files = [];
  if (fs.existsSync(FILES_JSON_PATH)) {
    const data = fs.readFileSync(FILES_JSON_PATH, 'utf-8');
    files = JSON.parse(data);
  }
  
  // Check if the file is empty before adding the new filename
  if (!files.includes(fileName)) {
    files.push(fileName);
  }
  
  fs.writeFileSync(FILES_JSON_PATH, JSON.stringify(files, null, 2));
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