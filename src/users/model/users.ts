import { Column, DataType, Model, Table } from "sequelize-typescript";

@Table({ tableName: "users", timestamps: true, createdAt: "created_at", updatedAt: "updated_at" })
export class UsersModel extends Model {
    @Column({
        type: DataType.UUID,
        primaryKey: true,
        defaultValue: DataType.UUIDV4,
    })
    declare id: string;

    @Column({
        type: DataType.TEXT,
        allowNull: false,
        unique: true,
    })
    declare firebase_uid: string;

    @Column({
        type: DataType.TEXT,
        allowNull: false,
    })
    declare username: string;

    @Column({
        type: DataType.TEXT,
        allowNull: false,
        unique: true,
    })
    declare email: string;

    @Column({
        type: DataType.DATE,
        defaultValue: DataType.NOW,
    })
    declare created_at: Date;

    @Column({
        type: DataType.DATE,
        defaultValue: DataType.NOW,
    })
    declare updated_at: Date;
}
