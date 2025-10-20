import { IsEnum, IsNotEmpty, IsUUID } from "class-validator";
import { RelatedTypes } from "../model/messages";

export class GetMessagesByRelatedDto {
    @IsUUID()
    @IsNotEmpty()
    relatedId: string;

    @IsEnum(RelatedTypes)
    @IsNotEmpty()
    relatedType: RelatedTypes;
}
