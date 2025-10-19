import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateDocumentDto } from "./dto/create-document.dto";
import { UpdateDocumentDto } from "./dto/update-document.dto";
import { DocumentsModel } from "./model/documents";
import { InjectModel } from "@nestjs/sequelize";
import { Document, UpdatedDocument } from "./entities/document.entity";

@Injectable()
export class DocumentsService {
    constructor(
        @InjectModel(DocumentsModel)
        private documentsModel: typeof DocumentsModel
    ) {}

    async create(createDocumentDto: CreateDocumentDto): Promise<Document> {
        const document = await this.documentsModel.create({
            user_id: createDocumentDto.user_id,
        });

        return {
            id: document.id,
            userId: document.user_id,
            name: document.name,
            isPublic: document.is_public,
            content: document.content,
            publicCode: document.public_code,
            createdAt: document.created_at,
            updatedAt: document.updated_at,
        };
    }

    async findByUserId(userId: string): Promise<DocumentsModel[]> {
        const documents = await this.documentsModel.findAll({
            where: { user_id: userId },
            attributes: [
                "id",
                "name",
                ["is_public", "isPublic"],
                ["public_code", "publicCode"],
                ["created_at", "createdAt"],
                ["updated_at", "updatedAt"],
            ],
        });

        if (documents.length <= 0) {
            throw new NotFoundException(`Nenhum documento foi encontrado`);
        }

        return documents;
    }

    async findByPublicCode(publicCode: string): Promise<DocumentsModel> {
        const document = await this.documentsModel.findOne({
            where: {
                public_code: publicCode,
            },
            attributes: [
                "id",
                "name",
                "content",
                ["is_public", "isPublic"],
                ["public_code", "publicCode"],
                ["created_at", "createdAt"],
                ["updated_at", "updatedAt"],
            ],
        });

        if (!document) {
            throw new NotFoundException(`Documento não encontrado`);
        }

        return document;
    }

    async update(
        documentId: string,
        userId: string,
        updateDocumentDto: UpdateDocumentDto
    ): Promise<UpdatedDocument> {
        const document = await this.documentsModel.findByPk(documentId);

        if (!document) {
            throw new NotFoundException(`Documento não encontrado`);
        }

        if (document.user_id !== userId) {
            throw new NotFoundException(`Documento não pertence a este usuário`);
        }

        const newDocument = await document.update(updateDocumentDto, {
            silent: false,
        });

        return {
            id: newDocument.id,
            content: newDocument.content,
            name: newDocument.name,
            updatedAt: newDocument.updated_at,
        };
    }

    async remove(id: string, userId: string): Promise<{ message: string }> {
        const document = await this.documentsModel.findByPk(id);

        if (!document) {
            throw new NotFoundException(`Documento não encontrado`);
        }

        if (document.user_id !== userId) {
            throw new NotFoundException(`Documento não pertence a este usuário`);
        }

        await document.destroy();

        return { message: "Documento removido com sucesso" };
    }
}
