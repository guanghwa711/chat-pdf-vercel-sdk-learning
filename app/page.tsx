"use client";

import { useState } from "react";
import ChatSection from "./components/chat-section";
import EmailAssistant from "./components/email-assistant";
import { Button } from "./components/ui/button";
// import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./components/ui/select";

export default function Home() {
  const [selectedAssistant, setSelectedAssistant] = useState<string>("email");

  // const handleSelectChange = (value: string) => {
  //   setSelectedAssistant(value);
  // };

  const toggleAssistant = (value: string) => {
    setSelectedAssistant(value);
  };

  return (
    <main className="flex min-h-screen flex-col items-center gap-4 px-24 py-20 background-gradient">
      {/* <Select required onValueChange={handleSelectChange} defaultValue={selectedAssistant}>
        <SelectTrigger>
          <SelectValue placeholder="Select Assistant" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="chat">Chat Assistant</SelectItem>
          <SelectItem value="email">Email Assistant</SelectItem>
        </SelectContent>
      </Select> */}

      <div className="flex">
        <Button
          onClick={() => toggleAssistant("email")}
          className={`${selectedAssistant === "email" ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-gray-300 hover:bg-gray-400 text-black"
            } h-14 text-xl font-bold w-44 rounded-none rounded-l-lg px-4 py-2 transition duration-200 border border-gray-300`}
        >
          Email Assistant
        </Button>
        <Button
          onClick={() => toggleAssistant("chat")}
          className={`${selectedAssistant === "chat" ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-gray-300 hover:bg-gray-400 text-black"
            } h-14 text-xl font-bold w-44 rounded-none rounded-r-lg px-4 py-2 transition duration-200 border border-gray-300`}
        >
          PDF Chat
        </Button>
      </div>

      {selectedAssistant === "chat" && <ChatSection />}
      {selectedAssistant === "email" && <EmailAssistant />}
    </main>
  );
}
