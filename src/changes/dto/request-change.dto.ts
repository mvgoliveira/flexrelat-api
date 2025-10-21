import { IsNotEmpty, IsString, IsOptional } from "class-validator";

export class RequestChangeDto {
    @IsString()
    @IsNotEmpty()
    text: string;

    @IsString()
    @IsOptional()
    content: string;
}
