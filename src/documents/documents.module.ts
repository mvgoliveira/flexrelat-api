import { Module } from "@nestjs/common";
import { DocumentsService } from "./documents.service";
import { DocumentsController } from "./documents.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { DocumentsModel } from "./model/documents";

@Module({
    imports: [SequelizeModule.forFeature([DocumentsModel])],
    controllers: [DocumentsController],
    providers: [DocumentsService],
})
export class DocumentsModule {}
