import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { exec } from "child_process";

export async function DELETE(request: NextRequest) {
    try {
        const { filename } = await request.json();
        const dataDir = path.join(process.cwd(), "data");
        const cacheDir = path.join(process.cwd(), "cache");
        const filePath = path.join(dataDir, filename);

        if (!fs.existsSync(filePath)) {
            return NextResponse.json({ error: "File not found" }, { status: 404 });
        }

        fs.unlinkSync(filePath);

        if (fs.existsSync(cacheDir)) {
            const files = fs.readdirSync(cacheDir);
            files.forEach(file => {
              const filePath = path.join(cacheDir, file);
              fs.truncateSync(filePath, 0);
            });
        };

        const remainingFiles = fs.readdirSync(dataDir).filter(file => file.endsWith(".pdf"));

        if (remainingFiles.length > 0) {
            await runGenerateCommand();
        }

        return NextResponse.json({ message: "File deleted successfully" });
    } catch (error) {
        console.error("Error deleting file:", error);
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