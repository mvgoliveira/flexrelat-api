import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";
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

    @IsString()
    @IsOptional()
    attachments: string;
}
