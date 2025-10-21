import { IsEnum, IsNotEmpty, IsUUID } from "class-validator";
import { StatusTypes } from "../model/changes";

export class UpdateStatusDto {
    @IsUUID()
    @IsNotEmpty()
    id: string;

    @IsEnum(StatusTypes)
    @IsNotEmpty()
    status: "pending" | "approved" | "rejected";
}
