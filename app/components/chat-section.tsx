"use client";

import { useEffect, useState } from "react";
import { MODEL } from "@/constants";
import { useChat } from "ai/react";
import { ChatInput, ChatMessages } from "./ui/chat";
import FileUploader from "./ui/file-uploader";
import { Loader2 } from "lucide-react";

export default function ChatSection() {
  const {
    messages,
    input,
    isLoading,
    handleSubmit,
    handleInputChange,
    reload,
    stop,
  } = useChat({ api: "/api/chat" });

  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [loadingFiles, setLoadingFiles] = useState<boolean>(true);

  useEffect(() => {
    async function fetchFiles() {
      try {
        const response = await fetch("/api/files");
        if (!response.ok) {
          throw new Error("Failed to fetch files");
        }
        const data = await response.json();
        setUploadedFiles(data.files);
      } catch (error) {
        console.error("Error fetching files:", error);
      } finally {
        setLoadingFiles(false);
      }
    }

    fetchFiles();
  }, []);

  async function handleFileUpload(file: File) {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload file");
      }

      setUploadedFiles((prevFiles) => [...prevFiles, file.name]);
      console.log("File uploaded successfully");
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error uploading file:", error.message);
      } else {
        console.error("An unknown error occurred during file upload");
      }
    }
  }

  return (
    <div className="flex space-x-4 max-w-8xl w-full">
      <div className="w-1/5 space-y-4">
        <div className="bg-white p-4 shadow-xl rounded-xl h-full">
          <h2 className="text-lg font-bold mb-2">Files Inventory</h2>
          <div className="mb-4">
            <FileUploader
              onFileUpload={handleFileUpload}
              config={{
                allowedExtensions: ["pdf"],
                disabled: isLoading,
              }}
            />
          </div>
          <div className="mt-4 h-[50vh] overflow-y-auto divide-y divide-gray-300">
            {loadingFiles ? (
              <div className="flex justify-center items-center h-full">
                <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
              </div>
            ) : uploadedFiles.length === 0 ? (
              <div className="text-sm text-gray-500 py-2 text-center">
                No files
              </div>
            ) : (
              uploadedFiles.map((fileName, index) => (
                <div key={index} className="text-sm text-gray-700 py-2">
                  {fileName}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <div className="w-4/5 space-y-4">
        <ChatMessages
          messages={messages}
          isLoading={isLoading}
          reload={reload}
          stop={stop}
        />
        <ChatInput
          input={input}
          handleSubmit={handleSubmit}
          handleInputChange={handleInputChange}
          isLoading={isLoading}
          multiModal={MODEL === "gpt-3.5-turbo"}
          uploadedFiles={uploadedFiles}
        />
      </div>
    </div>
  );
}
