import { Controller, Post, Body, UseGuards, HttpCode, HttpStatus, Patch } from "@nestjs/common";
import { ChangesService } from "./changes.service";
import { GetChangeDto } from "./dto/get-change.dto";
import { UpdateStatusDto } from "./dto/update-status.dto";
import { SessionCookieAuthGuard } from "src/auth";

@Controller("changes")
export class ChangesController {
    constructor(private readonly changesService: ChangesService) {}

    @Post("more-text")
    @UseGuards(SessionCookieAuthGuard)
    @HttpCode(HttpStatus.OK)
    async moreText(@Body() getChangeDto: GetChangeDto) {
        const response = await this.changesService.moreText(getChangeDto);
        return { data: response };
    }

    @Post("less-text")
    @UseGuards(SessionCookieAuthGuard)
    @HttpCode(HttpStatus.OK)
    async lessText(@Body() getChangeDto: GetChangeDto) {
        const response = await this.changesService.lessText(getChangeDto);
        return { data: response };
    }

    @Post("fix-orthography")
    @UseGuards(SessionCookieAuthGuard)
    @HttpCode(HttpStatus.OK)
    async fixOrography(@Body() getChangeDto: GetChangeDto) {
        const response = await this.changesService.fixOrography(getChangeDto);
        return { data: response };
    }

    @Post("improve-text")
    @UseGuards(SessionCookieAuthGuard)
    @HttpCode(HttpStatus.OK)
    async improveText(@Body() getChangeDto: GetChangeDto) {
        const response = await this.changesService.improveText(getChangeDto);
        return { data: response };
    }

    @Patch("update-status")
    @UseGuards(SessionCookieAuthGuard)
    @HttpCode(HttpStatus.OK)
    async updateChangeStatus(@Body() updateStatusDto: UpdateStatusDto) {
        const response = await this.changesService.updateChangeStatus(updateStatusDto);
        return { data: response };
    }
}
