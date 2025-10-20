import {
    Body,
    Controller,
    Post,
    Res,
    Req,
    HttpCode,
    HttpStatus,
    UseGuards,
    Delete,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { Response, Request } from "express";
import { SessionCookieAuthGuard } from "./guards/session-cookie-auth.guard";
import { CurrentUser } from "./decorators/current-user.decorator";
import { SessionUser } from "./interfaces/session-user.interface";

@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post("register")
    async register(@Body() registerDto: RegisterDto) {
        return await this.authService.register(registerDto);
    }

    @Post("login")
    @HttpCode(HttpStatus.OK)
    async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response) {
        const result = await this.authService.login(loginDto);

        const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 dias em milissegundos
        const sessionCookie = await this.authService.createSessionCookie(result.idToken, expiresIn);

        const options = {
            maxAge: expiresIn,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // true em produção (HTTPS)
            sameSite:
                process.env.NODE_ENV === "production" ? ("strict" as const) : ("lax" as const),
            path: "/",
        };

        res.cookie("session", sessionCookie, options);

        return {
            message: result.message,
            user: result.user,
        };
    }

    @Post("logout")
    @HttpCode(HttpStatus.OK)
    async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        const sessionCookie = req.cookies?.session as string | undefined;

        if (sessionCookie) {
            try {
                // Verificar e revogar o session cookie
                const decodedClaims = await this.authService.verifySessionCookie(sessionCookie);
                await this.authService.revokeRefreshTokens(decodedClaims.uid);
            } catch {
                // Mesmo que a verificação falhe, limpar o cookie
            }
        }

        // Limpar o cookie
        res.clearCookie("session", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite:
                process.env.NODE_ENV === "production" ? ("strict" as const) : ("lax" as const),
            path: "/",
        });

        return { message: "Logout realizado com sucesso" };
    }

    @Post("verify-email")
    async verifyEmail(@Body("oob-code") oobCode: string) {
        return await this.authService.verifyEmail(oobCode);
    }

    @Post("reset-password/send")
    async sendResetPasswordEmail(@Body("email") email: string) {
        return await this.authService.sendPasswordResetEmail(email);
    }

    @Post("reset-password/verify")
    async verifyPasswordResetCode(@Body("oob-code") oobCode: string) {
        return await this.authService.verifyPasswordResetCode(oobCode);
    }

    @Post("reset-password/confirm")
    async confirmPasswordReset(
        @Body("oob-code") oobCode: string,
        @Body("new-password") newPassword: string
    ) {
        return await this.authService.confirmPasswordReset({ oobCode, newPassword });
    }

    @Delete("delete-account")
    @UseGuards(SessionCookieAuthGuard)
    async deleteAccount(@CurrentUser() user: SessionUser) {
        return await this.authService.deleteAccount(user.id, user.uid);
    }
}
