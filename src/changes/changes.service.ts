import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { GetChangeDto } from "./dto/get-change.dto";
import { RequestChangeDto } from "./dto/request-change.dto";
import { CreateChangeDto } from "./dto/create-change.dto";
import { OpenAiService } from "src/openai/openai.service";
import { Change } from "./entities/change.entity";
import { ChangesModel, StatusTypes } from "./model/changes";
import { UpdateStatusDto } from "./dto/update-status.dto";

interface AIChangeResponse {
    text: string;
    changes?: Array<{
        type: "create" | "update" | "delete";
        status: "pending" | "approved" | "rejected";
        text: string;
        old_content: {
            id: string;
            html: string;
        };
        new_content: {
            id: string;
            html: string;
        };
    }>;
}

@Injectable()
export class ChangesService {
    constructor(
        private openAiService: OpenAiService,
        @InjectModel(ChangesModel)
        private changesModel: typeof ChangesModel
    ) {}

    async moreText(getChangeDto: GetChangeDto) {
        return await this.openAiService.sendMessage(
            `Deixe esse texto mais longo, mas não muito, sem alterar o tipo do elemento html: ${getChangeDto.content}`
        );
    }

    async lessText(getChangeDto: GetChangeDto) {
        return await this.openAiService.sendMessage(
            `Encurte esse texto, mas não muito: ${getChangeDto.content}`
        );
    }

    async fixOrography(getChangeDto: GetChangeDto) {
        return await this.openAiService.sendMessage(
            `Corrija a ortografia desse texto: ${getChangeDto.content}`
        );
    }

    async improveText(getChangeDto: GetChangeDto) {
        return await this.openAiService.sendMessage(`Melhore esse texto: ${getChangeDto.content}`);
    }

    async findByMessageId(messageId: string): Promise<Change[]> {
        const changes = await this.changesModel.findAll({
            where: {
                message_id: messageId,
            },
        });

        return changes.map(change => ({
            id: change.id,
            message_id: change.message_id,
            status: change.status,
            type: change.type,
            text: change.text,
            old_content: change.old_content,
            new_content: change.new_content,
        }));
    }

    async findById(id: string): Promise<Change | null> {
        const change = await this.changesModel.findByPk(id);

        if (!change) {
            return null;
        }

        return {
            id: change.id,
            message_id: change.message_id,
            status: change.status,
            type: change.type,
            text: change.text,
            old_content: change.old_content,
            new_content: change.new_content,
        };
    }

    async sendChangeRequest(requestChangeDto: RequestChangeDto): Promise<{
        text: string;
        changes: Change[];
    }> {
        const prompt = `Solicitação: ${requestChangeDto.text}
            ${requestChangeDto.content ? `\n\nConteúdo HTML atual:\n${requestChangeDto.content}` : ""}`;

        const aiResponse = await this.openAiService.sendChangeRequest(prompt);

        try {
            let cleanResponse = aiResponse.trim();
            if (cleanResponse.startsWith("```json")) {
                cleanResponse = cleanResponse.replace(/^```json\n/, "").replace(/\n```$/, "");
            } else if (cleanResponse.startsWith("```")) {
                cleanResponse = cleanResponse.replace(/^```\n/, "").replace(/\n```$/, "");
            }

            const parsedResponse = JSON.parse(cleanResponse) as AIChangeResponse;

            return {
                text: parsedResponse.text,
                changes:
                    parsedResponse.changes?.map(change => ({
                        status: "pending",
                        type: change.type,
                        text: change.text,
                        old_content: change.old_content,
                        new_content: change.new_content,
                    })) || [],
            };
        } catch {
            throw new BadRequestException("Falha ao processar resposta da IA");
        }
    }

    async createChange(createChangeDto: CreateChangeDto): Promise<Change> {
        const change = await this.changesModel.create({
            message_id: createChangeDto.message_id,
            status: createChangeDto.status,
            type: createChangeDto.type,
            text: createChangeDto.text,
            old_content: createChangeDto.old_content,
            new_content: createChangeDto.new_content,
        });

        return {
            id: change.id,
            message_id: change.message_id,
            status: change.status,
            type: change.type,
            text: change.text,
            old_content: change.old_content,
            new_content: change.new_content,
        };
    }

    async updateChangeStatus(updateStatusDto: UpdateStatusDto): Promise<Change> {
        const change = await this.changesModel.findByPk(updateStatusDto.id);

        if (!change) {
            throw new BadRequestException("Alteração não encontrada");
        }

        change.status =
            StatusTypes[updateStatusDto.status.toUpperCase() as keyof typeof StatusTypes];

        await change.save();

        return {
            id: change.id,
            message_id: change.message_id,
            status: change.status,
            type: change.type,
            text: change.text,
            old_content: change.old_content,
            new_content: change.new_content,
        };
    }
}
