import { Module } from "@nestjs/common";
import { OpenAiService } from "./openai.service";
import { OpenAiController } from "./openai.controller";

@Module({
    controllers: [OpenAiController],
    providers: [OpenAiService],
})
export class OpenAiModule {}
