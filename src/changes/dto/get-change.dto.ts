import { IsNotEmpty, IsString } from "class-validator";

export class GetChangeDto {
    @IsNotEmpty()
    @IsString()
    content: string;
}
