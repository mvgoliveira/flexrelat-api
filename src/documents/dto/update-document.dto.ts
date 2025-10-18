import { PartialType } from "@nestjs/mapped-types";
import { IsOptional, IsString } from "class-validator";
import { CreateDocumentDto } from "./create-document.dto";

export class UpdateDocumentDto extends PartialType(CreateDocumentDto) {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    content?: string;
}
