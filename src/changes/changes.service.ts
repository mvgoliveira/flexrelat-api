import { Injectable } from "@nestjs/common";
import { GetChangeDto } from "./dto/get-change.dto";
import { OpenAiService } from "src/openai/openai.service";

@Injectable()
export class ChangesService {
    constructor(private openAiService: OpenAiService) {}

    async moreText(getChangeDto: GetChangeDto) {
        return await this.openAiService.sendMessage(
            `Deixe esse texto mais longo, mas não muito: ${getChangeDto.content}`
        );
    }

    async lessText(getChangeDto: GetChangeDto) {
        return await this.openAiService.sendMessage(
            `Encurte esse texto, mas não muito: ${getChangeDto.content}`
        );
    }

    async fixOrography(getChangeDto: GetChangeDto) {
        return await this.openAiService.sendMessage(
            `Corrija a ortografia desse texto: ${getChangeDto.content}`
        );
    }

    async improveText(getChangeDto: GetChangeDto) {
        return await this.openAiService.sendMessage(`Melhore esse texto: ${getChangeDto.content}`);
    }
}
