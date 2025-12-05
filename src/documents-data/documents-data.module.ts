import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { DocumentsDataService } from "./documents-data.service";
import { DocumentsDataController } from "./documents-data.controller";
import { DocumentsDataModel } from "./model/documentsData";

@Module({
    imports: [SequelizeModule.forFeature([DocumentsDataModel])],
    controllers: [DocumentsDataController],
    providers: [DocumentsDataService],
    exports: [DocumentsDataService],
})
export class DocumentsDataModule {}
