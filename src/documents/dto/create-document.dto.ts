import { IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateDocumentDto {
    @IsUUID()
    @IsNotEmpty()
    user_id: string;

    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    content?: string;
}
