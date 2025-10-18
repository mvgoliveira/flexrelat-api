import { Controller, Get, Post, Body, Patch, Param, Delete } from "@nestjs/common";
import { DocumentsService } from "./documents.service";
import { UpdateDocumentDto } from "./dto/update-document.dto";

@Controller("documents")
export class DocumentsController {
    constructor(private readonly documentsService: DocumentsService) {}

    @Post(":user_id")
    create(@Param("user_id") userId: string) {
        return this.documentsService.create({ user_id: userId });
    }

    @Get("user/:userId")
    findByUserId(@Param("userId") userId: string) {
        return this.documentsService.findByUserId(userId);
    }

    @Get("public/:publicCode")
    findByPublicCode(@Param("publicCode") publicCode: string) {
        return this.documentsService.findByPublicCode(publicCode);
    }

    @Patch(":id")
    update(@Param("id") id: string, @Body() updateDocumentDto: UpdateDocumentDto) {
        return this.documentsService.update(id, updateDocumentDto);
    }

    @Delete(":id")
    remove(@Param("id") id: string) {
        return this.documentsService.remove(id);
    }
}
