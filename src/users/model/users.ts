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
        type: DataType.STRING,
        allowNull: false,
    })
    declare username: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare email: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare password: string;

    @Column({
        type: DataType.DATE,
    })
    declare created_at: Date;

    @Column({
        type: DataType.DATE,
    })
    declare updated_at: Date;
}
