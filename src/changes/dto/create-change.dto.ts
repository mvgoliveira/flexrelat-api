import { IsEnum, IsNotEmpty, IsString, IsUUID, IsObject } from "class-validator";
import { StatusTypes, ChangesTypes, ContentData } from "../model/changes";

export class CreateChangeDto {
    @IsUUID()
    @IsNotEmpty()
    message_id: string;

    @IsEnum(StatusTypes)
    @IsNotEmpty()
    status: "pending" | "approved" | "rejected";

    @IsEnum(ChangesTypes)
    @IsNotEmpty()
    type: "create" | "update" | "delete";

    @IsString()
    @IsNotEmpty()
    text: string;

    @IsObject()
    @IsNotEmpty()
    old_content: ContentData;

    @IsObject()
    @IsNotEmpty()
    new_content: ContentData;
}
