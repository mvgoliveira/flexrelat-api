import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateModelDto } from "./dto/create-model.dto";
import { UpdateModelDto } from "./dto/update-model.dto";
import { ModelsModel } from "./model/models";
import { DocumentsModel } from "../documents/model/documents";
import { InjectModel } from "@nestjs/sequelize";
import { Model } from "./entities/model.entity";
import { OpenAiService } from "src/openai/openai.service";

@Injectable()
export class ModelsService {
    constructor(
        @InjectModel(ModelsModel)
        private modelsModel: typeof ModelsModel,
        @InjectModel(DocumentsModel)
        private documentsModel: typeof DocumentsModel,
        private openAiService: OpenAiService
    ) {}

    async create(userId: string, createModelDto: CreateModelDto): Promise<Model> {
        const documentExist = await this.documentsModel.findOne({
            where: { id: createModelDto.document_id },
            attributes: ["content"],
        });

        if (!documentExist) {
            throw new NotFoundException(`Documento não encontrado`);
        }

        if (documentExist.user_id === userId) {
            throw new NotFoundException(`Documento não pertence a este usuário`);
        }

        let content = documentExist.content;

        if (createModelDto.ai_generation) {
            content = await this.openAiService.sendMessage(
                `Com base no seguinte conteúdo do relatório, crie um modelo reutilizável:` +
                    "\n\n" +
                    documentExist.content
            );
        }

        const model = await this.modelsModel.create({
            ...createModelDto,
            user_id: userId,
            content: content,
        });

        return {
            id: model.id,
            userId: model.user_id,
            name: model.name,
            description: model.description,
            publicCode: model.public_code,
            keywords: model.keywords,
            createdAt: model.created_at,
            updatedAt: model.updated_at,
            content: model.content,
        };
    }

    async findById(modelId: string): Promise<Model> {
        const model = await this.modelsModel.findByPk(modelId);

        if (!model) {
            throw new NotFoundException(`Modelo não encontrado`);
        }

        return {
            id: model.id,
            userId: model.user_id,
            name: model.name,
            publicCode: model.public_code,
            content: model.content,
            description: model.description,
            keywords: model.keywords,
            createdAt: model.created_at,
            updatedAt: model.updated_at,
        };
    }

    async findByUserId(userId: string): Promise<ModelsModel[]> {
        const models = await this.modelsModel.findAll({
            where: { user_id: userId },
            attributes: [
                "id",
                "name",
                "user_id",
                ["public_code", "publicCode"],
                "description",
                "keywords",
                ["created_at", "createdAt"],
                ["updated_at", "updatedAt"],
            ],
        });

        if (models.length <= 0) {
            throw new NotFoundException(`Nenhum modelo encontrado para o usuário`);
        }

        return models;
    }

    async findByPublicCode(publicCode: string): Promise<ModelsModel> {
        const model = await this.modelsModel.findOne({
            where: { public_code: publicCode },
            attributes: [
                "id",
                "name",
                ["user_id", "userId"],
                "content",
                ["public_code", "publicCode"],
                "description",
                "keywords",
                ["created_at", "createdAt"],
                ["updated_at", "updatedAt"],
            ],
        });

        if (!model) {
            throw new NotFoundException(`Modelo não encontrado`);
        }

        return model;
    }

    async update(
        modelId: string,
        userId: string,
        updateModelDto: UpdateModelDto
    ): Promise<ModelsModel> {
        const model = await this.modelsModel.findByPk(modelId);

        if (!model) {
            throw new NotFoundException(`Modelo não encontrado`);
        }

        if (model.user_id !== userId) {
            throw new NotFoundException(`Modelo não pertence a este usuário`);
        }

        await model.update(updateModelDto);

        return model;
    }

    async remove(modelId: string): Promise<{ message: string }> {
        const model = await this.modelsModel.findByPk(modelId);

        if (!model) {
            throw new NotFoundException(`Modelo não encontrado`);
        }

        await model.destroy();

        return { message: "Modelo removido com sucesso" };
    }
}
