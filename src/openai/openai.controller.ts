import { Controller, Post, Body } from "@nestjs/common";
import { OpenAiService } from "./openai.service";

@Controller("openai")
export class OpenAiController {
    constructor(private openAiService: OpenAiService) {}

    @Post("chat")
    async chat(@Body() body: { prompt: string }) {
        return { reply: await this.openAiService.sendMessage(body.prompt) };
    }
}
