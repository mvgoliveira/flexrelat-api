import { Column, DataType, Model, Table } from "sequelize-typescript";

export enum RelatedTypes {
    MODELS = "models",
    DOCUMENTS = "documents",
}

@Table({ tableName: "messages", timestamps: false })
export class MessagesModel extends Model {
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
    declare sender_id: string;

    @Column({
        type: DataType.UUID,
        allowNull: false,
    })
    declare related_id: string;

    @Column({
        type: DataType.ENUM(...Object.values(RelatedTypes)),
        allowNull: false,
    })
    declare related_type: RelatedTypes;

    @Column({
        type: DataType.TEXT,
        allowNull: false,
    })
    declare text: string;

    @Column({
        type: DataType.DATE,
        defaultValue: DataType.NOW,
        allowNull: false,
    })
    declare created_at: Date;
}
