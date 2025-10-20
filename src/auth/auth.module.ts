import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UsersModule } from "../users/users.module";
import { SessionCookieStrategy } from "./strategies/session-cookie.strategy";
import { PassportModule } from "@nestjs/passport";

@Module({
    imports: [UsersModule, PassportModule],
    controllers: [AuthController],
    providers: [AuthService, SessionCookieStrategy],
    exports: [AuthService],
})
export class AuthModule {}
