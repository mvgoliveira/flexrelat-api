import { Module } from "@nestjs/common";
import { MessagesService } from "./messages.service";
import { MessagesController } from "./messages.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { MessagesModel } from "./model/messages";

@Module({
    imports: [SequelizeModule.forFeature([MessagesModel])],
    controllers: [MessagesController],
    providers: [MessagesService],
})
export class MessagesModule {}
