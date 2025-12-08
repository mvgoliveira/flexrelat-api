import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from "@nestjs/common";
import { ModelsService } from "./models.service";
import { UpdateModelDto } from "./dto/update-model.dto";
import { CreateModelDto } from "./dto/create-model.dto";
import { SessionUser, CurrentUser, SessionCookieAuthGuard } from "src/auth";

@Controller("models")
export class ModelsController {
    constructor(private readonly modelsService: ModelsService) {}

    @Post("")
    @UseGuards(SessionCookieAuthGuard)
    create(@Body() createModelDto: CreateModelDto, @CurrentUser() user: SessionUser) {
        return this.modelsService.create(user.id, createModelDto);
    }

    @Get("user")
    @UseGuards(SessionCookieAuthGuard)
    findByUserId(@CurrentUser() user: SessionUser) {
        return this.modelsService.findByUserId(user.id);
    }

    @Get("public/:publicCode")
    findByPublicCode(@Param("publicCode") publicCode: string) {
        return this.modelsService.findByPublicCode(publicCode);
    }

    @Get("official")
    findOfficial() {
        return this.modelsService.findByUserId("00000000-0000-0000-0000-000000000000");
    }

    @Patch(":modelId")
    @UseGuards(SessionCookieAuthGuard)
    update(
        @Param("modelId") modelId: string,
        @Body() updateDocumentDto: UpdateModelDto,
        @CurrentUser() user: SessionUser
    ) {
        return this.modelsService.update(modelId, user.id, updateDocumentDto);
    }

    @Delete(":modelId")
    @UseGuards(SessionCookieAuthGuard)
    remove(@Param("modelId") modelId: string) {
        return this.modelsService.remove(modelId);
    }
}
