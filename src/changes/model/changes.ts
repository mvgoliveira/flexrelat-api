import { Column, DataType, Model, Table } from "sequelize-typescript";

export enum StatusTypes {
    PENDING = "pending",
    APPROVED = "approved",
    REJECTED = "rejected",
}

export enum ChangesTypes {
    CREATE = "create",
    UPDATE = "update",
    DELETE = "delete",
}

export interface ContentData {
    id: string;
    html: string;
}

@Table({ tableName: "ai_changes", timestamps: false })
export class ChangesModel extends Model {
    @Column({
        type: DataType.UUID,
        primaryKey: true,
        defaultValue: DataType.UUIDV4,
    })
    declare id: string;

    @Column({
        type: DataType.UUID,
        allowNull: false,
    })
    declare message_id: string;

    @Column({
        type: DataType.ENUM(...Object.values(StatusTypes)),
        allowNull: false,
    })
    declare status: StatusTypes;

    @Column({
        type: DataType.ENUM(...Object.values(ChangesTypes)),
        allowNull: false,
    })
    declare type: ChangesTypes;

    @Column({
        type: DataType.TEXT,
        allowNull: false,
    })
    declare text: string;

    @Column({
        type: DataType.JSONB,
        allowNull: false,
    })
    declare old_content: ContentData;

    @Column({
        type: DataType.JSONB,
        allowNull: false,
    })
    declare new_content: ContentData;
}
