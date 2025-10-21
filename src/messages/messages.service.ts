import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common";
import { CreateMessageDto } from "./dto/create-message.dto";
import { InjectModel } from "@nestjs/sequelize";
import { MessagesModel } from "./model/messages";
import { Message } from "./entities/message.entity";
import { DocumentsService } from "src/documents/documents.service";
import { ModelsService } from "src/models/models.service";
import { ChangesService } from "src/changes/changes.service";
import { Change } from "src/changes/entities/change.entity";

@Injectable()
export class MessagesService {
    constructor(
        @InjectModel(MessagesModel)
        private messagesModel: typeof MessagesModel,
        private documentsService: DocumentsService,
        private modelsService: ModelsService,
        private changesService: ChangesService
    ) {}

    private formatMessage(message: MessagesModel, changes: Change[]): Message {
        return {
            id: message.id,
            text: message.text,
            sender_id: message.sender_id,
            related_id: message.related_id,
            related_type: message.related_type,
            created_at: message.created_at.toISOString(),
            changes,
        };
    }

    async sendMessage(
        userId: string,
        createMessageDto: CreateMessageDto
    ): Promise<{ response: Change[] }> {
        let content: string = "";

        if (createMessageDto.relatedType === ("documents" as any)) {
            const document = await this.documentsService.findById(createMessageDto.relatedId);

            if (!document) {
                throw new NotFoundException("Documento não encontrado");
            }

            if (document.isPublic === false && document.userId !== userId) {
                throw new ForbiddenException("Acesso negado ao documento privado");
            }

            content = document.content || "";
        }

        if (createMessageDto.relatedType === ("models" as any)) {
            const model = await this.modelsService.findById(createMessageDto.relatedId);

            if (!model) {
                throw new NotFoundException("Modelo não encontrado");
            }

            content = model.content || "";
        }

        await this.messagesModel.create({
            sender_id: userId,
            related_id: createMessageDto.relatedId,
            related_type: createMessageDto.relatedType,
            text: createMessageDto.text,
        });

        const previousMessages = await this.messagesModel.findAll({
            where: {
                related_id: createMessageDto.relatedId,
                related_type: createMessageDto.relatedType,
            },
            order: [["created_at", "ASC"]],
            limit: 5, // Últimas 5 mensagens para contexto
        });

        let prompt = createMessageDto.text;

        if (previousMessages.length > 0) {
            const context = previousMessages
                .map(
                    msg =>
                        `${msg.sender_id === "00000000-0000-0000-0000-000000000000" ? "FlexBot" : "Usuário"}: ${msg.text}`
                )
                .join("\n");

            prompt = `Histórico da conversa:\n${context}\n\nNova mensagem do usuário: ${createMessageDto.text}`;
        }

        const response = await this.changesService.sendFileChangeRequest({
            text: prompt,
            content: content,
        });

        const chatMessage = await this.messagesModel.create({
            sender_id: "00000000-0000-0000-0000-000000000000",
            related_id: createMessageDto.relatedId,
            related_type: createMessageDto.relatedType,
            text: response.text,
        });

        const changes = await Promise.all(
            response.changes.map(async changeDto => {
                const change = await this.changesService.createChange({
                    message_id: chatMessage.id,
                    status: "pending",
                    type: changeDto.type,
                    text: changeDto.text,
                    old_content: changeDto.old_content,
                    new_content: changeDto.new_content,
                });

                return change;
            })
        );

        return {
            response: changes,
        };
    }

    async findByRelated(relatedId: string, relatedType: string): Promise<Message[]> {
        const messages = await this.messagesModel.findAll({
            where: {
                related_id: relatedId,
                related_type: relatedType,
            },
            order: [["created_at", "ASC"]],
        });

        const messagesWithChanges = await Promise.all(
            messages.map(async message => {
                if (message.sender_id === "00000000-0000-0000-0000-000000000000") {
                    const changes = await this.changesService.findByMessageId(message.id);

                    return this.formatMessage(message, changes);
                }

                return this.formatMessage(message, []);
            })
        );

        return messagesWithChanges;
    }

    async clearAllMessages(
        relatedId: string,
        relatedType: string
    ): Promise<{ message: string; deletedCount: number }> {
        if (relatedType === "documents") {
            const document = await this.documentsService.findById(relatedId);

            if (!document) {
                throw new NotFoundException("Documento não encontrado");
            }
        }

        if (relatedType === "models") {
            const model = await this.modelsService.findById(relatedId);

            if (!model) {
                throw new NotFoundException("Modelo não encontrado");
            }
        }

        const deletedCount = await this.messagesModel.destroy({
            where: {
                related_id: relatedId,
                related_type: relatedType,
            },
        });

        return {
            message: "Mensagens removidas com sucesso",
            deletedCount,
        };
    }
}
