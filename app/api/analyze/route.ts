import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { exec } from "child_process";

async function deleteCache() {
  const cacheDir = path.join(process.cwd(), "cache");

  if (fs.existsSync(cacheDir)) {
    fs.readdirSync(cacheDir).forEach(file => {
      fs.unlinkSync(path.join(cacheDir, file));
    });
  }
}

async function regenerateVectorData() {
  return new Promise((resolve, reject) => {
    exec("npm run generate", (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing generate script: ${stderr}`);
        return reject(new Response("Internal server error", { status: 500 }));
      }
      console.log(`Generate script output: ${stdout}`);
      resolve(NextResponse.json({ message: "Vector data regenerated successfully" }));
    });
  });
}

export async function POST() {
  try {
    await deleteCache();
    await regenerateVectorData();
    return NextResponse.json({ message: "Cache deleted and vector data regenerated successfully" });
  } catch (error) {
    console.error("Error in analyze API:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}