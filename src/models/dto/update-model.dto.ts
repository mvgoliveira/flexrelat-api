import { PartialType } from "@nestjs/mapped-types";
import { CreateModelDto } from "./create-model.dto";
import { IsOptional, IsString } from "class-validator";

export class UpdateModelDto extends PartialType(CreateModelDto) {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    content?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsString({ each: true })
    keywords?: string[];
}
