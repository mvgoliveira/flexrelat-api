import { Module } from "@nestjs/common";
import { ChangesService } from "./changes.service";
import { ChangesController } from "./changes.controller";
import { OpenAiModule } from "src/openai/openai.module";

@Module({
    imports: [OpenAiModule],
    controllers: [ChangesController],
    providers: [ChangesService],
})
export class ChangesModule {}
