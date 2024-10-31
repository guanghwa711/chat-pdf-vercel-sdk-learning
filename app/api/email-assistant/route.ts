import { MODEL, OPENAI_API_KEY } from "@/constants";
import { Message, StreamingTextResponse } from "ai";
import { MessageContent, OpenAI } from "llamaindex";
import { NextRequest, NextResponse } from "next/server";
import { createEmailAssistantChatEngine } from "./engine";
import { LlamaIndexStream } from "../chat/llamaindex-stream";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const getLastMessageContent = (
    textMessage: string,
    imageUrl: string | undefined
): MessageContent => {
    if (!imageUrl) return textMessage;
    return [
        {
            type: "text",
            text: textMessage,
        },
        {
            type: "image_url",
            image_url: {
                url: imageUrl,
            },
        },
    ];
};

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const auth = request.headers.get("Authorization") || "";

        const { messages }: { messages: Message[];} = body;
        const lastMessage = messages.pop();
        if (!messages || !lastMessage || lastMessage.role !== "user") {
            return NextResponse.json(
                {
                    error:
                        "messages are required in the request body and the last message must be from the user",
                },
                { status: 400 }
            );
        }

        const llm = new OpenAI({
            apiKey: OPENAI_API_KEY,
            model: MODEL,
            maxTokens: 2048,
        });

        const chatEngine = await createEmailAssistantChatEngine(llm, auth); // Use the new chat engine

        const lastMessageContent = getLastMessageContent(
            lastMessage.content,
            body?.data?.imageUrl
        );

        const response = await chatEngine.chat(
            lastMessageContent as MessageContent,
            //@ts-ignore
            messages,
            true
        );

        const stream = LlamaIndexStream(response);

        return new StreamingTextResponse(stream);
    } catch (error) {
        console.error("[EmailAssistant]", error);
        return NextResponse.json(
            {
                error: (error as Error).message,
            },
            {
                status: 500,
            }
        );
    }
}