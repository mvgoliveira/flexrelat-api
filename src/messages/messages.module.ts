import { Module } from "@nestjs/common";
import { MessagesService } from "./messages.service";
import { MessagesController } from "./messages.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { MessagesModel } from "./model/messages";
import { DocumentsModule } from "src/documents/documents.module";
import { ModelsModule } from "src/models/models.module";
import { ChangesModule } from "src/changes/changes.module";

@Module({
    imports: [
        SequelizeModule.forFeature([MessagesModel]),
        DocumentsModule,
        ModelsModule,
        ChangesModule,
    ],
    controllers: [MessagesController],
    providers: [MessagesService],
})
export class MessagesModule {}
