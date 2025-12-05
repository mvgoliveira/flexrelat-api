import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { DocumentsModel } from "../../documents/model/documents";

@Table({
    tableName: "documents_data",
    timestamps: false,
})
export class DocumentsDataModel extends Model {
    @Column({
        type: DataType.UUID,
        primaryKey: true,
        defaultValue: DataType.UUIDV4,
    })
    declare id: string;

    @ForeignKey(() => DocumentsModel)
    @Column({
        type: DataType.UUID,
        allowNull: false,
    })
    declare document_id: string;

    @BelongsTo(() => DocumentsModel)
    declare document: DocumentsModel;

    @Column({
        type: DataType.TEXT,
        allowNull: false,
    })
    declare name: string;

    @Column({
        type: DataType.JSONB,
        allowNull: false,
    })
    declare value: object;

    @Column({
        type: DataType.ENUM("csv", "xls", "xlsx", "json", "pdf", "text"),
        allowNull: false,
    })
    declare type: string;
}
