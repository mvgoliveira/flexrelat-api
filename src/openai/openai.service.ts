import { BadRequestException, Injectable } from "@nestjs/common";
import OpenAI from "openai";

@Injectable()
export class OpenAiService {
    private client = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });

    async sendMessage(prompt: string): Promise<string> {
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
            temperature: 0.5,
        });

        return res.choices[0].message.content || "";
    }

    async sendFileChangeRequest(prompt: string): Promise<string> {
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
                    - Não insira dados falsos ou inventados, apenas dados tirados documento.
                    - Responda apenas se a solicitação estiver dentro do seu escopo.
                    - Responda APENAS com o html que deve ser modificado no relatório, sem quebras de linha ou estilizações, a menos que pedido explicitamente.
                    - Se a solicitação estiver fora do escopo: responda algo como: "Não consigo responder essa pergunta. Gostaria de ajuda com algo relacionado ao relatório?"

                    FORMATO DE SAÍDA:
                    - Retorne um JSON com o seguinte formato (sem markdown, sem explicações):
                    - Cada change deve ser de um componente html apenas, somente UM pai.
                    - Quando é feito uma criação, o old_content dever ser o conteúdo acima do novo componente. quando for um conteúdo pra ser adicionado no topo o id deve ser vazio.
                    - Quando tiver mais de um componente a ser inserido ou atualizado, crie várias changes.
                    {
                        "text": "Texto de confirmação da alteração com resumo curtíssimo",
                        "changes": [
                            {
                                "type": "create" | "update" | "delete",
                                "text": "Descrição da alteração",
                                "old_content": {
                                    "id": "id do elemento",
                                    "html": "HTML antigo"
                                },
                                "new_content": {
                                    "id": "",
                                    "html": "HTML novo sem nenhum data-id com apenas um elemento pai"
                                }
                            }
                        ]
                    }
                `,
            },
            {
                role: "user",
                content: prompt,
            },
        ];

        const res = await this.client.chat.completions.create({
            model: "gpt-4.1-mini",
            response_format: { type: "json_object" },
            messages,
            temperature: 1,
        });

        if (!res.choices[0].message.content) {
            throw new BadRequestException("No content in AI response");
        }

        return res.choices[0].message.content;
    }
}
