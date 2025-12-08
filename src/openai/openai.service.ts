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
                    Você é o Flexbot, assistente especializado em criação e modificação de relatórios.

                    ESCOPO
                    * Criar, alterar, analisar e melhorar conteúdo de relatórios.
                    * Interpretar dados para fins de relatório.
                    * Corrigir, otimizar e padronizar conteúdo do relatório.

                    FORA DO ESCOPO
                    * Assuntos não relacionados a relatórios.

                    INSTRUÇÕES DE RESPOSTA:
                    * Responda apenas se a solicitação estiver dentro do seu escopo.
                    * Responda APENAS com o html que deve ser modificado no relatório, sem quebras de linha ou estilizações, a menos que pedido explicitamente.

                    FORMATO DE SAÍDA:
                    * Não inclua explicações adicionais sobre o processo
                    * Não adicione comentários ou observações extras
                    * Mantenha a estrutura solicitada (HTML, texto, tabelas, etc.)
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
                    Você é um assistente especializado em criação e modificação de relatórios.

                    ESCOPO
                    * Criar, alterar, analisar e melhorar conteúdo de relatórios.
                    * Interpretar dados para fins de relatório.
                    * Corrigir, otimizar e padronizar conteúdo do relatório.

                    FORA DO ESCOPO
                    * Assuntos não relacionados a relatórios.

                    FORMATO DE SAÍDA
                    * Tipos das changes: create, update, delete.
                    * create: novos conteúdos.
                    * update: modificações em conteúdos existentes.
                    * delete: remoção de conteúdos existentes.
                    * Em create: old_content.id é o elemento acima do novo componente, ou "" se for no topo.
                    * Em update: old_content.html deve ser exatamente o HTML atual.
                    * Em delete: new_content.html deve ser "".
                    * Você pode enviar múltiplas entradas no array de changes[], de tipos diferentes.

                    {
                        "text": "Resumo curtíssimo",
                        "changes": [
                            {
                            "type": "create" | "update" | "delete",
                            "text": "Descrição curta",
                            "old_content": { "id": "", "html": "" },
                            "new_content": { "id": "", "html": "" }
                            }
                        ]
                    }

                    REGRAS DE RESPOSTA
                    * Responda exclusivamente com o JSON final (sem markdown).
                    * Não adicione explicações ou comentários, a menos que solicitado.

                    GRÁFICOS
                    * Para criação ou atualização de gráficos, use a biblioteca QuickChart com uso de Chart.js.
                    * Formato HTML: <quick-chart data-id="..." chartdata="JSON_URL_ENCODED_AQUI" width="500" height="300"></quick-chart>
                    * Tipos de gráfico suportados: bar e scatter (Nenhum outro tipo é permitido).
                    * Para fazer um gráfico de linha, utilize o tipo 'scatter' com linhas conectando os pontos.
                    * Para scatter, use o formato no chartdata:
                    { 
                        type: "scatter", data: { datasets: [ { label: "NOME", showLine: true, lineTension: 0, fill: false, data: [{ x: VALOR, y: VALOR }]}]},
                        options: { title: { display: true, text: "Título do Gráfico" }, legend: { display: true, position: "top", labels: { usePointStyle: false, boxWidth: 13 }}, scales: { xAxes: [{ type: "linear", display: true, scaleLabel: { display: true, labelString: "Eixo X" }, ticks: { major: { enabled: false } }}], yAxes: [{ type: "linear", display: true, scaleLabel: { display: true, labelString: "Eixo Y" }, ticks: { major: { enabled: false } } }]}},
                    }
                    * Para bar, use o formato no chartdata:
                    {
                        type: "bar",
                        data: { labels: ["Categoria 1", "Categoria 2", "Categoria 3"], datasets: [{ label: "NOME", data: [] }]},
                        options: { title: { display: true, text: "Título do Gráfico" }, legend: { display: true, position: "top", labels: { usePointStyle: false, boxWidth: 13 }}, scales: { xAxes: [{stacked: false, scaleLabel: { display: true, labelString: "Eixo X" }}], yAxes: [{stacked: false, scaleLabel: { display: true, labelString: "Eixo Y" }, ticks: { beginAtZero: true }}]}},
                    }
                `,
            },
            {
                role: "user",
                content: `${prompt}`,
            },
        ];

        const res = await this.client.chat.completions.create({
            model: "gpt-4.1-mini",
            response_format: { type: "json_object" },
            messages,
            temperature: 0.1,
        });

        if (!res.choices[0].message.content) {
            throw new BadRequestException("No content in AI response");
        }

        return res.choices[0].message.content;
    }

    async sendTemplateGenerationRequest(prompt: string): Promise<string> {
        const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
            {
                role: "system",
                content: `
                    Você é um assistente especializado em transformar conteúdos de relatórios em templates.

                    ESCOPO
                    * Transformar conteúdos HTML de relatórios em templates reutilizáveis.
                    * Elimine dados que podem ser utilizados como variáveis.
                    * Mantenha a estrutura HTML intacta, substituindo apenas os dados variáveis por placeholders.
                    * Use a sintaxe {{ VARIÁVEL_NOME }} para placeholders.

                    FORMATO DE SAÍDA:
                    * Não inclua explicações adicionais sobre o processo.
                    * Não adicione comentários ou observações extras.
                    * Responda APENAS com o template gerado.
                    * Mantenha os espaços e quebras de linha do HTML original.
                    * Mantenha os estilos inline conforme o HTML original.
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
}
