// app.module.ts
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { OpenAiModule } from "./openai/openai.module";
import { ChangesModule } from "./changes/changes.module";
import { SequelizeConfig } from "./sequelizeConfig";
import { UsersModule } from "./users/users.module";
import { DocumentsModule } from "./documents/documents.module";
import { ModelsModule } from "./models/models.module";
import { AuthModule } from "./auth/auth.module";
import { FirebaseConfig } from "./firebaseConfig";

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        SequelizeConfig,
        FirebaseConfig,
        OpenAiModule,
        ChangesModule,
        UsersModule,
        DocumentsModule,
        ModelsModule,
        AuthModule,
    ],
})
export class AppModule {}
