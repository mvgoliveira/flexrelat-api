import { Injectable } from "@nestjs/common";
import { CreateMessageDto } from "./dto/create-message.dto";
import { InjectModel } from "@nestjs/sequelize";
import { MessagesModel } from "./model/messages";
import { Message } from "./entities/message.entity";

@Injectable()
export class MessagesService {
    constructor(
        @InjectModel(MessagesModel)
        private messagesModel: typeof MessagesModel
    ) {}

    private formatMessage(message: MessagesModel): Message {
        return {
            id: message.id,
            senderId: message.sender_id,
            relatedId: message.related_id,
            relatedType: message.related_type,
            text: message.text,
            createdAt: message.created_at,
        };
    }

    async sendMessage(
        userId: string,
        createMessageDto: CreateMessageDto
    ): Promise<{ response: Message }> {
        await this.messagesModel.create({
            sender_id: userId,
            related_id: createMessageDto.relatedId,
            related_type: createMessageDto.relatedType,
            text: createMessageDto.text,
        });

        const aiResponseText = `Recebi sua mensagem: "${createMessageDto.text}". Esta é uma resposta padrão da IA.`;

        const aiMessage = await this.messagesModel.create({
            sender_id: "00000000-0000-0000-0000-000000000000",
            related_id: createMessageDto.relatedId,
            related_type: createMessageDto.relatedType,
            text: aiResponseText,
        });

        return {
            response: this.formatMessage(aiMessage),
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

        return messages.map(message => this.formatMessage(message));
    }
}
