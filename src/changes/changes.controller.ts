import { Controller, Post, Body, Res } from "@nestjs/common";
import { ChangesService } from "./changes.service";
import { GetChangeDto } from "./dto/get-change.dto";
import { Response } from "express";

@Controller("changes")
export class ChangesController {
    constructor(private readonly changesService: ChangesService) {}

    @Post("more-text")
    async create(@Body() getChangeDto: GetChangeDto, @Res() res: Response) {
        try {
            if (!getChangeDto.content) {
                return res.status(400).json({
                    message: "Invalid input data, content field is required",
                });
            }

            const response = await this.changesService.moreText(getChangeDto);

            return res.status(200).json({
                data: response,
            });
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "Unknown error";
            return res.status(500).json({
                message: "Error making more longer",
                error: errorMessage,
            });
        }
    }

    @Post("less-text")
    async lessText(@Body() getChangeDto: GetChangeDto, @Res() res: Response) {
        try {
            if (!getChangeDto.content) {
                return res.status(400).json({
                    message: "Invalid input data, content field is required",
                });
            }

            const response = await this.changesService.lessText(getChangeDto);

            return res.status(200).json({
                data: response,
            });
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "Unknown error";
            return res.status(500).json({
                message: "Error making less text",
                error: errorMessage,
            });
        }
    }

    @Post("fix-orthography")
    async fixOrography(@Body() getChangeDto: GetChangeDto, @Res() res: Response) {
        try {
            if (!getChangeDto.content) {
                return res.status(400).json({
                    message: "Invalid input data, content field is required",
                });
            }

            const response = await this.changesService.fixOrography(getChangeDto);

            return res.status(200).json({
                data: response,
            });
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "Unknown error";
            return res
                .status(500)
                .json({ message: "Error fixing orthography", error: errorMessage });
        }
    }

    @Post("improve-text")
    async improveText(@Body() getChangeDto: GetChangeDto, @Res() res: Response) {
        try {
            if (!getChangeDto.content) {
                return res.status(400).json({
                    message: "Invalid input data, content field is required",
                });
            }

            const response = await this.changesService.improveText(getChangeDto);

            return res.status(200).json({
                data: response,
            });
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "Unknown error";
            return res.status(500).json({
                message: "Error improving text",
                error: errorMessage,
            });
        }
    }
}
