import { IsNotEmpty, IsString, IsUUID, IsEnum } from "class-validator";

export class CreateDocumentsDataDto {
    @IsUUID()
    @IsNotEmpty()
    document_id: string;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    value: object;

    @IsEnum(["csv", "xls", "xlsx", "json", "pdf", "text"])
    @IsNotEmpty()
    type: string;
}
