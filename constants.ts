type Model = "gpt-3.5-turbo" | "gpt-3.5-turbo-16k" | "gpt-3.5-turbo-1106" | "gpt-4" | "gpt-4-32k" | "gpt-4-1106-preview" | "gpt-4-vision-preview";

export const MODEL: Model = process.env.MODEL as Model || "gpt-3.5-turbo";
export const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "default-api-key";
