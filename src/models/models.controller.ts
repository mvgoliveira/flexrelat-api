import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from "@nestjs/common";
import { ModelsService } from "./models.service";
import { UpdateModelDto } from "./dto/update-model.dto";
import { CreateModelDto } from "./dto/create-model.dto";
import { AuthUser, CurrentUser, FirebaseJwtAuthGuard } from "src/auth";

@Controller("models")
export class ModelsController {
    constructor(private readonly modelsService: ModelsService) {}

    @Post("")
    @UseGuards(FirebaseJwtAuthGuard)
    create(@Body() createModelDto: CreateModelDto, @CurrentUser() user: AuthUser) {
        return this.modelsService.create(user.id, createModelDto);
    }

    @Get("user")
    @UseGuards(FirebaseJwtAuthGuard)
    findByUserId(@CurrentUser() user: AuthUser) {
        return this.modelsService.findByUserId(user.id);
    }

    @Get("public/:publicCode")
    findByPublicCode(@Param("publicCode") publicCode: string) {
        return this.modelsService.findByPublicCode(publicCode);
    }

    @Patch(":modelId")
    @UseGuards(FirebaseJwtAuthGuard)
    update(
        @Param("modelId") modelId: string,
        @Body() updateDocumentDto: UpdateModelDto,
        @CurrentUser() user: AuthUser
    ) {
        return this.modelsService.update(modelId, user.id, updateDocumentDto);
    }

    @Delete(":modelId")
    @UseGuards(FirebaseJwtAuthGuard)
    remove(@Param("modelId") modelId: string) {
        return this.modelsService.remove(modelId);
    }
}
