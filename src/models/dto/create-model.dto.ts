import { IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateModelDto {
    @IsUUID()
    @IsNotEmpty()
    user_id: string;

    @IsNotEmpty()
    @IsUUID()
    document_id: string;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsOptional()
    @IsString({ each: true })
    keywords?: string[];
}
