import { Column, DataType, Model, Table } from "sequelize-typescript";

@Table({
    tableName: "documents",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
})
export class DocumentsModel extends Model {
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
    declare user_id: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    declare name: string;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    })
    declare is_public: boolean;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true,
        defaultValue: () => Math.random().toString(36).substring(2, 10).toUpperCase(),
    })
    declare public_code: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    declare content: string;

    @Column({
        type: DataType.DATE,
        allowNull: false,
        defaultValue: DataType.NOW,
    })
    declare created_at: Date;

    @Column({
        type: DataType.DATE,
        defaultValue: DataType.NOW,
    })
    declare updated_at: Date;
}
