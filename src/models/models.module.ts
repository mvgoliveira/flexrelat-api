import { Module } from "@nestjs/common";
import { ModelsService } from "./models.service";
import { ModelsController } from "./models.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { ModelsModel } from "./model/models";
import { DocumentsModel } from "../documents/model/documents";
import { OpenAiModule } from "src/openai/openai.module";

@Module({
    imports: [OpenAiModule, SequelizeModule.forFeature([ModelsModel, DocumentsModel])],
    controllers: [ModelsController],
    providers: [ModelsService],
    exports: [ModelsService],
})
export class ModelsModule {}
