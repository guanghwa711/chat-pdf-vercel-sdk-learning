// import { NextResponse } from "next/server";
// import fs from "fs";
// import path from "path";
// import { STORAGE_DIR } from "../chat/engine/constants.mjs";

// const FILES_JSON_PATH = path.join(STORAGE_DIR, 'files.json');

// // Function to initialize the files.json if it doesn't exist or is empty
// function initializeFilesJson() {
//   if (!fs.existsSync(FILES_JSON_PATH) || fs.readFileSync(FILES_JSON_PATH, 'utf-8').trim() === '') {
//     fs.writeFileSync(FILES_JSON_PATH, JSON.stringify([], null, 2)); // Create an empty array
//   }
// }

// export async function GET() {
//   try {
//     // Initialize the files.json
//     initializeFilesJson();

//     const data = fs.readFileSync(FILES_JSON_PATH, 'utf-8');
//     const files = JSON.parse(data);
//     return NextResponse.json({ files });
//   } catch (error) {
//     console.error("Error reading files:", error);
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 });
//   }
// }