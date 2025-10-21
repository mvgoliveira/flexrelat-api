import { Module } from "@nestjs/common";
import { ChangesService } from "./changes.service";
import { ChangesController } from "./changes.controller";
import { OpenAiModule } from "src/openai/openai.module";
import { SequelizeModule } from "@nestjs/sequelize";
import { ChangesModel } from "./model/changes";

@Module({
    imports: [OpenAiModule, SequelizeModule.forFeature([ChangesModel])],
    controllers: [ChangesController],
    providers: [ChangesService],
    exports: [ChangesService],
})
export class ChangesModule {}
