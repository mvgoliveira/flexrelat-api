import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { get } from "env-var";
import { ValidationPipe } from "@nestjs/common";
import * as cookieParser from "cookie-parser";

async function bootstrap() {
    console.log("🚀 API is running on PORT:", get("PORT").asString() ?? 5000);

    const app = await NestFactory.create(AppModule, {
        snapshot: get("ENVIRONMENT").required().asString() != "production",
    });

    app.setGlobalPrefix("api");

    app.use(cookieParser());

    app.enableCors({
        // origin: get("FRONTEND_URL").required().asString(),
        origin: "*",
        credentials: true,
    });

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        })
    );

    await app.listen(get("PORT").required().asString() ?? 5000);
}
void bootstrap();
