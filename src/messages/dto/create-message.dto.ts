import { IsEnum, IsNotEmpty, IsString, IsUUID } from "class-validator";
import { RelatedTypes } from "../model/messages";

export class CreateMessageDto {
    @IsUUID()
    @IsNotEmpty()
    relatedId: string;

    @IsEnum(RelatedTypes)
    @IsNotEmpty()
    relatedType: RelatedTypes;

    @IsString()
    @IsNotEmpty()
    text: string;
}
