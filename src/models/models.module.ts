import { Module } from "@nestjs/common";
import { ModelsService } from "./models.service";
import { ModelsController } from "./models.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { ModelsModel } from "./model/models";
import { DocumentsModel } from "../documents/model/documents";

@Module({
    imports: [SequelizeModule.forFeature([ModelsModel, DocumentsModel])],
    controllers: [ModelsController],
    providers: [ModelsService],
})
export class ModelsModule {}
