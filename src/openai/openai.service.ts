import { Injectable } from "@nestjs/common";
import OpenAI from "openai";

@Injectable()
export class OpenAiService {
    private client = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });

    async sendMessage(prompt: string) {
        const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
            {
                role: "system",
                content:
                    "Você é um assistente que responde com três tópicos numerados e finaliza com um resumo em 2 frases.",
            },
            {
                role: "user",
                content: "Agrupe a seguinte receita em ingredientes e passos:\n" + prompt,
            },
            {
                role: "assistant",
                content: "1. Ingredientes:\n- ...\n2. Passos:\n- ...\nResumo: ...",
            },
        ];

        const res = await this.client.chat.completions.create({
            model: "gpt-4.1-mini",
            messages,
            temperature: 0.2,
        });
        return res.choices[0].message.content;
    }
}
