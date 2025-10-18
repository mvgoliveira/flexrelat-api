// app.module.ts
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { OpenAiModule } from "./openai/openai.module";
import { ChangesModule } from "./changes/changes.module";
import { SequelizeConfig } from "./ormconfig";

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        SequelizeConfig,
        OpenAiModule,
        ChangesModule,
    ],
})
export class AppModule {}
