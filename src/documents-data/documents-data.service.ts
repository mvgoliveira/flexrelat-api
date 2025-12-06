import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { CreateDocumentsDataDto } from "./dto/create-documents-data.dto";
import { UpdateDocumentsDataDto } from "./dto/update-documents-data.dto";
import { DocumentsDataModel } from "./model/documentsData";
import { PDFParse } from "pdf-parse";

@Injectable()
export class DocumentsDataService {
    constructor(
        @InjectModel(DocumentsDataModel)
        private documentsDataModel: typeof DocumentsDataModel
    ) {}

    async create(createDocumentsDataDto: CreateDocumentsDataDto) {
        return await this.documentsDataModel.create({
            document_id: createDocumentsDataDto.document_id,
            name: createDocumentsDataDto.name,
            value: createDocumentsDataDto.value,
            type: createDocumentsDataDto.type,
        });
    }

    async findByDocument(documentId: string) {
        const data = await this.documentsDataModel.findAll({
            where: {
                document_id: documentId,
            },
            attributes: ["id", "name", "type", "value"],
        });

        if (!data || data.length === 0) {
            throw new NotFoundException(`Dados não encontrados`);
        }

        return data;
    }

    async findById(id: string) {
        const data = await this.documentsDataModel.findByPk(id, {
            attributes: ["id", "name", "value", "type"],
        });

        if (!data) {
            throw new NotFoundException(`Dado não encontrado`);
        }

        return data;
    }

    async update(id: string, updateDocumentsDataDto: UpdateDocumentsDataDto) {
        const data = await this.documentsDataModel.findByPk(id);

        if (!data) {
            throw new NotFoundException(`Dado não encontrados`);
        }

        return await data.update({
            value: updateDocumentsDataDto.value,
        });
    }

    async remove(id: string) {
        const data = await this.documentsDataModel.findByPk(id);

        if (!data) {
            throw new NotFoundException(`Dado não encontrados`);
        }

        await data.destroy();
        return { message: "Dado removido com sucesso" };
    }

    async parseFileContent(file: Express.Multer.File): Promise<{ text: string }> {
        if (!file) {
            throw new BadRequestException("Nenhum arquivo foi enviado");
        }

        if (file.mimetype === "application/pdf") {
            try {
                const parser = new PDFParse({ data: file.buffer });
                const result = await parser.getText();
                await parser.destroy();
                return { text: result.text };
            } catch (err) {
                const msg = err instanceof Error ? err.message : "Erro desconhecido";
                throw new BadRequestException(`Erro ao processar o PDF: ${msg}`);
            }
        }

        throw new BadRequestException("Formato de arquivo inválido.");
    }
}
