import { Module } from "@nestjs/common";
import { DocumentsService } from "./documents.service";
import { DocumentsController } from "./documents.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { DocumentsModel } from "./model/documents";
import { UsersModel } from "../users/model/users";

@Module({
    imports: [SequelizeModule.forFeature([DocumentsModel, UsersModel])],
    controllers: [DocumentsController],
    providers: [DocumentsService],
    exports: [DocumentsService],
})
export class DocumentsModule {}
