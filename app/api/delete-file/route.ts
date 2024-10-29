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

export async function DELETE(request: NextRequest) {
  try {
    // Initialize the files.json
    initializeFilesJson();

    const { filename } = await request.json();
    const filePath = path.join(STORAGE_DIR, filename);

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    fs.unlinkSync(filePath);
    await updateFilesJsonOnDelete(filename);

    if (fs.existsSync(STORAGE_CACHE_DIR)) {
      const files = fs.readdirSync(STORAGE_CACHE_DIR);
      files.forEach(file => {
        const filePath = path.join(STORAGE_CACHE_DIR, file);
        fs.truncateSync(filePath, 0);
      });
    }

    const remainingFiles = fs.readdirSync(STORAGE_DIR).filter(file => file.endsWith(".pdf"));
    if (remainingFiles.length > 0) {
      await runGenerateCommand();
    }

    return NextResponse.json({ message: "File deleted successfully" });
  } catch (error) {
    console.error("Error deleting file:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

async function updateFilesJsonOnDelete(fileName: string) {
  if (fs.existsSync(FILES_JSON_PATH)) {
    const data = fs.readFileSync(FILES_JSON_PATH, 'utf-8');
    let files = JSON.parse(data);
    files = files.filter((file: any) => file !== fileName);
    fs.writeFileSync(FILES_JSON_PATH, JSON.stringify(files, null, 2));
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