import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";

@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post("register")
    async register(@Body() registerDto: RegisterDto) {
        return await this.authService.register(registerDto);
    }

    @Post("login")
    async login(@Body() loginDto: LoginDto) {
        return await this.authService.login(loginDto);
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
}
