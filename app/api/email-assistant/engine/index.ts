import {
    ContextChatEngine,
    LLM,
    VectorStoreIndex,
    Document
} from "llamaindex";
import { google } from "googleapis";

const MAX_LENGTH = 1000;

export async function createEmailAssistantChatEngine(llm: LLM, token: string) {
    const unreadEmails = await fetchUnreadEmails(token);

    const noEmailsResponse = new Document({
        text: "You have no unread emails at the moment."
    });

    const documents = unreadEmails.length > 0
        ? unreadEmails.flatMap((email) => {
            const bodyChunks = chunkText(email.body, MAX_LENGTH);
            return bodyChunks.map((chunk) =>
                new Document({ text: `From: ${email.from}\nSubject: ${email.subject}\nStatus: unread\nSnippet: ${email.snippet}\nBody: ${chunk}` })
            );
        }
        )
        : [noEmailsResponse];

    const index = await VectorStoreIndex.fromDocuments(documents);

    const retriever = index.asRetriever({
        similarityTopK: unreadEmails.length > 0 ? 5 : 1,
    });

    return new ContextChatEngine({
        chatModel: llm,
        retriever
    });
}

async function fetchUnreadEmails(auth: any) {
    const gmail = google.gmail('v1');
    const authClient = new google.auth.OAuth2();
    authClient.setCredentials({ access_token: auth });

    const gmailClient = await gmail.users.messages.list({
        userId: 'me',
        q: 'is:unread',
        auth: authClient,
    });

    const messages = gmailClient.data.messages || [];

    if (messages.length === 0) {
        console.log("No unread emails found.");
        return [];
    }

    const unreadEmails = await Promise.all(
        messages.map(async (message: any) => {
            const msg = await gmail.users.messages.get({
                userId: 'me',
                id: message.id,
                auth: authClient,
                format: 'full',
            });

            const headers = msg.data.payload?.headers || [];
            const subject = headers.find((header: any) => header.name === 'Subject')?.value || 'No Subject';
            const from = headers.find((header: any) => header.name === 'From')?.value || 'Unknown Sender';
            const snippet = msg.data.snippet || '';

            let body = '';
            if (msg.data.payload?.parts) {
                msg.data.payload.parts.forEach((part: any) => {
                    if (part.mimeType === 'text/plain') {
                        body += part.body.data ? Buffer.from(part.body.data, 'base64').toString('utf-8') : '';
                    }
                });
            } else {
                body = msg.data.payload?.body?.data ? Buffer.from(msg.data.payload.body.data, 'base64').toString('utf-8') : '';
            }

            return {
                id: msg.data.id,
                subject: subject,
                from: from,
                snippet: snippet,
                body: body,
            };
        })
    );

    return unreadEmails;
}

function chunkText(text: string, maxLength: number) {
    const words = text.split(" ");
    const chunks: string[] = [];
    let currentChunk = "";

    for (const word of words) {
        if ((currentChunk + word).length > maxLength) {
            chunks.push(currentChunk.trim());
            currentChunk = word + " ";
        } else {
            currentChunk += word + " ";
        }
    }

    if (currentChunk) {
        chunks.push(currentChunk.trim());
    }

    return chunks;
}