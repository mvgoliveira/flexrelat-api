import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    UseInterceptors,
    UploadedFile,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { DocumentsDataService } from "./documents-data.service";
import { CreateDocumentsDataDto } from "./dto/create-documents-data.dto";
import { UpdateDocumentsDataDto } from "./dto/update-documents-data.dto";
import { DocumentsDataModel } from "./model/documentsData";
import { SessionCookieAuthGuard } from "src/auth";

@Controller("documents-data")
export class DocumentsDataController {
    constructor(private readonly documentsDataService: DocumentsDataService) {}

    @Post()
    @UseGuards(SessionCookieAuthGuard)
    async create(
        @Body() createDocumentsDataDto: CreateDocumentsDataDto
    ): Promise<DocumentsDataModel> {
        const data = this.documentsDataService.create(createDocumentsDataDto);
        return data;
    }

    @Get(":document_id")
    @UseGuards(SessionCookieAuthGuard)
    async findByDocument(@Param("document_id") documentId: string) {
        const data = await this.documentsDataService.findByDocument(documentId);
        return data;
    }

    @Get("content/:id")
    @UseGuards(SessionCookieAuthGuard)
    async findById(@Param("id") id: string) {
        const data = await this.documentsDataService.findById(id);
        return data;
    }

    @Patch(":id")
    @UseGuards(SessionCookieAuthGuard)
    async update(@Param("id") id: string, @Body() updateDocumentsDataDto: UpdateDocumentsDataDto) {
        const data = this.documentsDataService.update(id, updateDocumentsDataDto);
        return data;
    }

    @Delete(":id")
    @UseGuards(SessionCookieAuthGuard)
    async remove(@Param("id") id: string) {
        return await this.documentsDataService.remove(id);
    }

    @Post("parser")
    @UseGuards(SessionCookieAuthGuard)
    @UseInterceptors(FileInterceptor("file"))
    async parseFile(@UploadedFile() file: Express.Multer.File) {
        const data = await this.documentsDataService.parseFileContent(file);
        return data;
    }
}
