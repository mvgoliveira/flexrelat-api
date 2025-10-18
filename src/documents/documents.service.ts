import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateDocumentDto } from "./dto/create-document.dto";
import { UpdateDocumentDto } from "./dto/update-document.dto";
import { DocumentsModel } from "./model/documents";
import { InjectModel } from "@nestjs/sequelize";
import { Document } from "./entities/document.entity";

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
            name: document.name,
            userId: document.user_id,
            isPublic: document.is_public,
            publicCode: document.public_code,
            createdAt: document.created_at,
            updatedAt: document.updated_at,
        };
    }

    async findByUserId(userId: string): Promise<Document[]> {
        const documents = await this.documentsModel.findAll({
            where: { user_id: userId },
        });

        if (documents.length <= 0) {
            throw new NotFoundException(`No documents found for user with id ${userId}`);
        }

        return documents.map(document => ({
            id: document.id,
            name: document.name,
            userId: document.user_id,
            isPublic: document.is_public,
            publicCode: document.public_code,
            createdAt: document.created_at,
            updatedAt: document.updated_at,
        }));
    }

    async findByPublicCode(publicCode: string): Promise<DocumentsModel> {
        const document = await this.documentsModel.findOne({
            where: { public_code: publicCode },
        });

        if (!document) {
            throw new NotFoundException(`Document with public code ${publicCode} not found`);
        }

        return document;
    }

    async update(id: string, updateDocumentDto: UpdateDocumentDto): Promise<DocumentsModel> {
        const document = await this.documentsModel.findByPk(id);

        if (!document) {
            throw new NotFoundException(`Document with id ${id} not found`);
        }

        await document.update(updateDocumentDto);

        return document;
    }

    async remove(id: string): Promise<{ message: string }> {
        const document = await this.documentsModel.findByPk(id);

        if (!document) {
            throw new NotFoundException(`Document with id ${id} not found`);
        }

        await document.destroy();

        return { message: "Documento removido com sucesso" };
    }
}
