import { Column, CreatedAt, DataType, Model, Table, UpdatedAt } from "sequelize-typescript";

@Table({
    tableName: "models",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
})
export class ModelsModel extends Model {
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
        type: DataType.TEXT,
        allowNull: true,
    })
    declare name: string;

    @Column({
        type: DataType.TEXT,
        allowNull: true,
    })
    declare description: string;

    @Column({
        type: DataType.ARRAY(DataType.TEXT),
        allowNull: true,
    })
    declare keywords: string[];

    @Column({
        type: DataType.TEXT,
        allowNull: false,
        unique: true,
        defaultValue: () => Math.random().toString(36).substring(2, 10).toUpperCase(),
    })
    declare public_code: string;

    @Column({
        type: DataType.TEXT,
        allowNull: true,
    })
    declare content: string;

    @CreatedAt
    @Column({
        type: DataType.DATE,
        allowNull: false,
        defaultValue: DataType.NOW,
    })
    declare created_at: Date;

    @UpdatedAt
    @Column({
        type: DataType.DATE,
        defaultValue: DataType.NOW,
    })
    declare updated_at: Date;
}
