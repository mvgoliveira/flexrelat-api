import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { RequestFileChangeDto } from "./dto/request-file-change.dto";
import { CreateChangeDto } from "./dto/create-change.dto";
import { OpenAiService } from "src/openai/openai.service";
import { Change } from "./entities/change.entity";
import { ChangesModel, StatusTypes } from "./model/changes";
import { UpdateStatusDto } from "./dto/update-status.dto";
import { RequestChangeDto } from "./dto/request-change.dto";

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

    async sendChangeRequest(requestChangeDto: RequestChangeDto) {
        return await this.openAiService.sendMessage(requestChangeDto.prompt);
    }

    async sendFileChangeRequest(requestFileChangeDto: RequestFileChangeDto): Promise<{
        text: string;
        changes: Change[];
    }> {
        const prompt = `Solicitação: ${requestFileChangeDto.text}
            ${requestFileChangeDto.content ? `\n\nConteúdo HTML atual:\n${requestFileChangeDto.content}` : ""}`;

        const aiResponse = await this.openAiService.sendFileChangeRequest(prompt);

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
