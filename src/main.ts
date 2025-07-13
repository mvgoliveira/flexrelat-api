import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { get } from "env-var";

async function bootstrap() {
    console.log("🚀 API is running on PORT:", get("PORT").asString() ?? 5000);

    const app = await NestFactory.create(AppModule, {
        snapshot: get("ENVIRONMENT").required().asString() != "production",
    });

    app.setGlobalPrefix("api");

    app.enableCors({
        origin: "*",
    });

    await app.listen(get("PORT").required().asString() ?? 5000);
}
void bootstrap();
