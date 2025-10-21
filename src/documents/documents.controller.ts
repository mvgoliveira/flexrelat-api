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
import { SessionUser, CurrentUser, SessionCookieAuthGuard } from "src/auth";

@Controller("documents")
export class DocumentsController {
    constructor(private readonly documentsService: DocumentsService) {}

    @Post()
    @UseGuards(SessionCookieAuthGuard)
    async create(@CurrentUser() user: SessionUser) {
        return this.documentsService.create({ user_id: user.id });
    }

    @Get("user")
    @UseGuards(SessionCookieAuthGuard)
    async findByUserId(@CurrentUser() user: SessionUser) {
        return await this.documentsService.findByUserId(user.id);
    }

    @Get("public/:publicCode")
    @UseGuards(SessionCookieAuthGuard)
    async findByPublicCode(@Param("publicCode") publicCode: string) {
        return await this.documentsService.findByPublicCode(publicCode);
    }

    @Patch(":documentId")
    @UseGuards(SessionCookieAuthGuard)
    async update(
        @Param("documentId") documentId: string,
        @CurrentUser() user: SessionUser,
        @Body() updateDocumentDto: UpdateDocumentDto
    ) {
        return await this.documentsService.update(documentId, user.id, updateDocumentDto);
    }

    @Delete(":documentId")
    @UseGuards(SessionCookieAuthGuard)
    async remove(@Param("documentId") documentId: string, @CurrentUser() user: SessionUser) {
        return await this.documentsService.remove(documentId, user.id);
    }
}
