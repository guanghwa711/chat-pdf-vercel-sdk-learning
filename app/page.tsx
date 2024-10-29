import ChatSection from "./components/chat-section";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center gap-10 p-24 background-gradient">
      <div className="text-4xl font-bold">PDF Chat</div>
      <ChatSection />
    </main>
  );
}
