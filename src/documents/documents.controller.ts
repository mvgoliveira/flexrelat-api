import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Headers,
} from "@nestjs/common";
import { DocumentsService } from "./documents.service";
import { UpdateDocumentDto } from "./dto/update-document.dto";
import { AuthUser, CurrentUser, FirebaseJwtAuthGuard } from "src/auth";

@Controller("documents")
export class DocumentsController {
    constructor(private readonly documentsService: DocumentsService) {}

    @Post()
    @UseGuards(FirebaseJwtAuthGuard)
    async create(@CurrentUser() user: AuthUser) {
        return this.documentsService.create({ user_id: user.id });
    }

    @Get("user")
    @UseGuards(FirebaseJwtAuthGuard)
    async findByUserId(@CurrentUser() user: AuthUser) {
        return await this.documentsService.findByUserId(user.id);
    }

    @Get("public/:publicCode")
    async findByPublicCode(@Param("publicCode") publicCode: string) {
        return await this.documentsService.findByPublicCode(publicCode);
    }

    @Patch(":documentId")
    @UseGuards(FirebaseJwtAuthGuard)
    async update(
        @Param("documentId") documentId: string,
        @CurrentUser() user: AuthUser,
        @Body() updateDocumentDto: UpdateDocumentDto
    ) {
        return await this.documentsService.update(documentId, user.id, updateDocumentDto);
    }

    @Delete(":documentId")
    @UseGuards(FirebaseJwtAuthGuard)
    async remove(@Param("documentId") documentId: string, @CurrentUser() user: AuthUser) {
        return await this.documentsService.remove(documentId, user.id);
    }
}
