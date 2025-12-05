import { IsNotEmpty } from "class-validator";

export class UpdateDocumentsDataDto {
    @IsNotEmpty()
    value: object;
}
