import { IsNotEmpty, IsString, IsOptional } from "class-validator";

export class RequestFileChangeDto {
    @IsString()
    @IsNotEmpty()
    text: string;

    @IsString()
    @IsOptional()
    content: string;

    @IsString()
    @IsOptional()
    attachments: string;
}
