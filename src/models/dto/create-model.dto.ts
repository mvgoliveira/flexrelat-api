import { IsBoolean, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateModelDto {
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

    @IsNotEmpty()
    @IsBoolean()
    ai_generation: boolean;
}
