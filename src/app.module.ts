// app.module.ts
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { OpenAiModule } from "./openai/openai.module";
import { ChangesModule } from "./changes/changes.module";

@Module({
    imports: [ConfigModule.forRoot({ isGlobal: true }), OpenAiModule, ChangesModule],
})
export class AppModule {}
