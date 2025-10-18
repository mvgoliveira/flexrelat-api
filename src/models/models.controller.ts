import { Controller, Get, Post, Body, Patch, Param, Delete } from "@nestjs/common";
import { ModelsService } from "./models.service";
import { UpdateModelDto } from "./dto/update-model.dto";
import { CreateModelDto } from "./dto/create-model.dto";

@Controller("models")
export class ModelsController {
    constructor(private readonly modelsService: ModelsService) {}

    @Post("")
    create(@Body() createModelDto: CreateModelDto) {
        return this.modelsService.create(createModelDto);
    }

    @Get("user/:userId")
    findByUserId(@Param("userId") userId: string) {
        return this.modelsService.findByUserId(userId);
    }

    @Get("public/:publicCode")
    findByPublicCode(@Param("publicCode") publicCode: string) {
        return this.modelsService.findByPublicCode(publicCode);
    }

    @Patch(":id")
    update(@Param("id") id: string, @Body() updateDocumentDto: UpdateModelDto) {
        return this.modelsService.update(id, updateDocumentDto);
    }

    @Delete(":id")
    remove(@Param("id") id: string) {
        return this.modelsService.remove(id);
    }
}
