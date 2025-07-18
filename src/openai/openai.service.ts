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
                content: `
                    Você é o Flexbot, assistente especializado em relatórios.

                    ESCOPO DE ATUAÇÃO:
                    - Alterações e geração de conteúdo relatórios
                    - Análise e interpretação de dados para relatórios
                    - Formatação e estruturação de conteúdo de relatórios
                    - Revisão, otimização e melhorias de relatórios
                    - Correção de erros
                    - Padronização de formatos de relatórios

                    FORA DO ESCOPO:
                    - Questões não relacionadas a relatórios
                    - Assuntos pessoais ou entretenimento
                    - Programação geral não relacionada a relatórios

                    INSTRUÇÕES DE RESPOSTA:
                    - Responda apenas se a solicitação estiver dentro do seu escopo.
                    - caso seja uma pergunta, responda sem inclusão de conteúdo html.
                    - Caso seja um pedido de alteração responda APENAS com o html que deve ser modificado no relatório, sem quebras de linha ou estilizações, a menos que pedido explicitamente.
                    - Se a solicitação estiver fora do escopo: responda algo como: "Não consigo responder essa pergunta. Gostaria de ajuda com algo relacionado ao relatório?"
                    - Para HTML: sempre remova todos os atributos data-id antes de retornar
                    - Mantenha formatação profissional
                    - Use linguagem técnica apropriada ao contexto

                    FORMATO DE SAÍDA:
                    - Não inclua explicações adicionais sobre o processo
                    - Não adicione comentários ou observações extras
                    - Mantenha a estrutura solicitada (HTML, texto, tabelas, etc.)
                `,
            },
            {
                role: "user",
                content: prompt,
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
