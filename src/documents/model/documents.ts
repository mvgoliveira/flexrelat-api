import {
    BelongsTo,
    Column,
    CreatedAt,
    DataType,
    ForeignKey,
    Model,
    Table,
    UpdatedAt,
} from "sequelize-typescript";
import { UsersModel } from "../../users/model/users";

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

    @ForeignKey(() => UsersModel)
    @Column({
        type: DataType.UUID,
        allowNull: false,
    })
    declare user_id: string;

    @BelongsTo(() => UsersModel)
    declare user: UsersModel;

    @Column({
        type: DataType.TEXT,
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
