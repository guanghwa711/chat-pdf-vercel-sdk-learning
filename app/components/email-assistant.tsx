"use client";

import { useEffect, useState } from "react";
import { useChat } from "ai/react";
import { ChatInput, ChatMessages } from "./ui/chat";
import SignInButton from "./ui/SignInButton";

export default function EmailAssistant() {
  const [authToken, setAuthToken] = useState<string | null>(null);
  useEffect(() => {
    const token = localStorage.getItem("oauthToken");
    setAuthToken(token);
  }, []);

  const {
    messages,
    input,
    isLoading,
    handleSubmit,
    handleInputChange,
    reload,
    stop,
    error,
  } = useChat({
    api: "/api/email-assistant",
    headers: {
      "Authorization": `${authToken || ""}`,
    },
  });

  return (
    <div className="flex flex-col max-w-8xl w-full p-6 bg-gray-100 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Email Assistant</h1>
        <SignInButton />
      </div>
      {error && (
        <p className="text-red-500 border border-red-500 rounded-xl p-4 bg-red-50 mb-4">
          {error.message}
        </p>
      )}
      <div className="flex flex-col rounded-xl shadow-sm overflow-hidden space-y-4">
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
          multiModal={false}
          uploadedFiles={[]}
          isEmailAssistant={true}
        />
      </div>
    </div>
  );
}