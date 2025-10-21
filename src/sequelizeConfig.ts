import { SequelizeModule } from "@nestjs/sequelize";
import { get } from "env-var";
import { UsersModel } from "./users/model/users";
import { DocumentsModel } from "./documents/model/documents";
import { ModelsModel } from "./models/model/models";
import { MessagesModel } from "./messages/model/messages";
import { ChangesModel } from "./changes/model/changes";

const SequelizeConfig = SequelizeModule.forRoot({
    dialect: "postgres",
    host: get("DATABASE_HOST").required().asString(),
    port: get("DATABASE_PORT").required().asPortNumber(),
    username: get("DATABASE_USERNAME").required().asString(),
    password: get("DATABASE_PASSWORD").required().asString(),
    database: get("DATABASE_NAME").required().asString(),
    models: [UsersModel, DocumentsModel, ModelsModel, MessagesModel, ChangesModel],
});

export { SequelizeConfig };
