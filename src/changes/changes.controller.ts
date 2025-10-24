import { Controller, Post, Body, UseGuards, Patch } from "@nestjs/common";
import { ChangesService } from "./changes.service";
import { UpdateStatusDto } from "./dto/update-status.dto";
import { SessionCookieAuthGuard } from "src/auth";
import { RequestChangeDto } from "./dto/request-change.dto";

@Controller("changes")
export class ChangesController {
    constructor(private readonly changesService: ChangesService) {}

    @Post("request-change")
    @UseGuards(SessionCookieAuthGuard)
    async sendChangeRequest(@Body() requestChangeDto: RequestChangeDto) {
        const response = await this.changesService.sendChangeRequest(requestChangeDto);
        return response;
    }

    @Patch("update-status")
    @UseGuards(SessionCookieAuthGuard)
    async updateChangeStatus(@Body() updateStatusDto: UpdateStatusDto) {
        const response = await this.changesService.updateChangeStatus(updateStatusDto);
        return response;
    }
}
