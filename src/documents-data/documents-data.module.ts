import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { DocumentsDataService } from "./documents-data.service";
import { DocumentsDataController } from "./documents-data.controller";
import { DocumentsDataModel } from "./model/documentsData";
import { MulterModule } from "@nestjs/platform-express";

@Module({
    imports: [SequelizeModule.forFeature([DocumentsDataModel]), MulterModule.register()],
    controllers: [DocumentsDataController],
    providers: [DocumentsDataService],
    exports: [DocumentsDataService],
})
export class DocumentsDataModule {}
