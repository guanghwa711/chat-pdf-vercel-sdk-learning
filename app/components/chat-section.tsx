"use client";

import { useEffect, useState } from "react";
import { MODEL } from "@/constants";
import { useChat } from "ai/react";
import { ChatInput, ChatMessages } from "./ui/chat";
import FileUploader from "./ui/file-uploader";
import { Loader2 } from "lucide-react";
import { Trash2 } from "lucide-react";
import { Button } from "./ui/button";

export default function ChatSection() {
  const {
    messages,
    input,
    isLoading,
    handleSubmit,
    handleInputChange,
    reload,
    stop,
    error
  } = useChat({ api: "/api/chat" });

  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [loadingFiles, setLoadingFiles] = useState<boolean>(true);
  const [loadingAnalyze, setLoadingAnalyze] = useState<boolean>(false);
  const [loadingDeleteCache, setLoadingDeleteCache] = useState<boolean>(false);

  useEffect(() => {
    async function fetchFiles() {
      try {
        const response = await fetch("/files.json");
        if (!response.ok) {
          throw new Error("Failed to fetch files");
        }

        const data = await response.json();
        setUploadedFiles(data);
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
      console.error("Error uploading file:", error);
    }
  }

  async function handleFileDelete(fileName: string) {
    setLoadingFiles(true)
    try {
      const response = await fetch("/api/delete-file", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ filename: fileName }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete file");
      }

      setUploadedFiles((prevFiles) => {
        const updatedFiles = prevFiles.filter((file) => file !== fileName);

        return updatedFiles;
      });

      console.log("File deleted successfully");
    } catch (error) {
      console.error("Error deleting file:", error);
    } finally {
      setLoadingFiles(false);
    }
  }

  async function handleDeleteCache() {
    setLoadingDeleteCache(true);
    try {
      const response = await fetch("/api/delete-cache", {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete cache");
      }

      console.log("Cache deleted successfully");
    } catch (error) {
      console.error("Error deleting cache:", error);
    } finally {
      setLoadingDeleteCache(false);
    }
  }

  async function handleAnalyze() {
    setLoadingAnalyze(true);
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to analyze");
      }

      console.log("Analysis completed successfully");
    } catch (error) {
      console.error("Error analyzing:", error);
    } finally {
      setLoadingAnalyze(false);
    }
  }

  return (
    <div className="flex flex-col max-w-8xl w-full p-6 bg-gray-100 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">PDF Chat</h1>
      <div className="flex space-x-4">
        <div className="w-1/5 space-y-4">
          <div className="bg-white p-4 shadow-md rounded-xl h-full">
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
            <div className="mt-4 h-[calc(100%-200px)] overflow-y-auto divide-y divide-gray-300">
              {loadingFiles ? (
                <div className="flex justify-center items-center h-full">
                  <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
                </div>
              ) : uploadedFiles?.length === 0 ? (
                <div className="text-sm text-gray-500 py-2 text-center">
                  No files
                </div>
              ) : (
                uploadedFiles?.map((fileName, index) => (
                  <div key={index} className="flex justify-between items-center py-2">
                    <span className="text-sm text-gray-700">{fileName}</span>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleFileDelete(fileName)}
                      aria-label={`Delete ${fileName}`}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))
              )}
            </div>
            <div className="mt-4">
              <Button onClick={handleDeleteCache} className="w-full mb-2" disabled={loadingDeleteCache}>
                {loadingDeleteCache ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  "Delete Vector Cache"
                )}
              </Button>
              <Button onClick={handleAnalyze} className="w-full" disabled={loadingAnalyze}>
                {loadingAnalyze ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  "Analyze"
                )}
              </Button>
            </div>
          </div>
        </div>
        <div className="rounded-xl w-4/5 space-y-4">
          {error && <p className="text-red-500 border border-red-500 m-4 rounded-xl p-4 bg-red-50">{error.message}</p>}
          <ChatMessages
            messages={messages}
            isLoading={isLoading}
            reload={reload}
            stop={stop}
            error={error}
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
    </div>
  );
}
