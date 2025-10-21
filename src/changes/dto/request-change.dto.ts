import { IsNotEmpty, IsString } from "class-validator";

export class RequestChangeDto {
    @IsNotEmpty()
    @IsString()
    prompt: string;
}
