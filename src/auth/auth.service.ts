import { Injectable, UnauthorizedException, ConflictException } from "@nestjs/common";
import { FirebaseProvider } from "@alpha018/nestjs-firebase-auth";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import axios from "axios";
import { get } from "env-var";
import { UsersService } from "../users/users.service";
import { ResetPasswordDto } from "./dto/resetPassword.dto";

@Injectable()
export class AuthService {
    constructor(
        private readonly firebaseProvider: FirebaseProvider,
        private readonly usersService: UsersService
    ) {}

    async register(registerDto: RegisterDto) {
        try {
            const { email, password, username } = registerDto;

            const userRecord = await this.firebaseProvider.auth.createUser({
                email,
                password,
                emailVerified: false,
            });

            try {
                const createdUser = await this.usersService.create({
                    email,
                    password,
                    username,
                    firebaseUid: userRecord.uid,
                });

                await this.sendVerificationEmail(userRecord.uid);

                return {
                    message: "Usuário registrado com sucesso. Email de verificação enviado.",
                    user: {
                        id: createdUser.id,
                        uid: userRecord.uid,
                        username: createdUser.username,
                        email: userRecord.email,
                        emailVerified: userRecord.emailVerified,
                    },
                };
            } catch (error) {
                await this.firebaseProvider.auth.deleteUser(userRecord.uid);
                throw error;
            }
        } catch (error: unknown) {
            const firebaseError = error as { code?: string };
            if (firebaseError.code === "auth/email-already-exists") {
                throw new ConflictException("Email já está em uso");
            }
            throw new UnauthorizedException("Erro ao criar usuário");
        }
    }

    async login(loginDto: LoginDto) {
        try {
            const { email, password } = loginDto;

            const response = await axios.post<{
                idToken: string;
                email: string;
                refreshToken: string;
                expiresIn: string;
                localId: string;
            }>(
                `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${get("FIREBASE_API_KEY").required().asString()}`,
                {
                    email,
                    password,
                    returnSecureToken: true,
                }
            );

            const { idToken, localId, refreshToken, expiresIn } = response.data;

            const userRecord = await this.firebaseProvider.auth.getUser(localId);

            if (!userRecord.emailVerified) {
                throw new UnauthorizedException("Email não verificado");
            }

            return {
                message: "Login realizado com sucesso",
                user: {
                    email: userRecord.email,
                    emailVerified: userRecord.emailVerified,
                },
                token: idToken,
                refreshToken,
                expiresIn,
            };
        } catch (error: unknown) {
            if (error instanceof UnauthorizedException) {
                throw error;
            }

            const axiosError = error as { response?: { data?: { error?: { message?: string } } } };
            if (axiosError.response?.data?.error) {
                const errorMessage = axiosError.response.data.error.message;
                if (
                    errorMessage === "INVALID_LOGIN_CREDENTIALS" ||
                    errorMessage === "EMAIL_NOT_FOUND" ||
                    errorMessage === "INVALID_PASSWORD"
                ) {
                    throw new UnauthorizedException("Email ou senha inválidos");
                }
            }

            throw new UnauthorizedException("Email ou senha inválidos");
        }
    }

    async sendVerificationEmail(userUid: string) {
        try {
            const customToken = await this.firebaseProvider.auth.createCustomToken(userUid);

            const tokenResponse = await axios.post<{ idToken: string }>(
                `https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${get("FIREBASE_API_KEY").required().asString()}`,
                { token: customToken, returnSecureToken: true }
            );

            await axios.post(
                `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${get("FIREBASE_API_KEY").required().asString()}`,
                {
                    requestType: "VERIFY_EMAIL",
                    idToken: tokenResponse.data.idToken,
                }
            );
            return { message: "Email de verificação enviado com sucesso" };
        } catch (error) {
            if (error instanceof UnauthorizedException) {
                throw error;
            }
            throw new UnauthorizedException("Erro ao enviar email de verificação");
        }
    }

    async verifyEmail(obbCode: string) {
        try {
            const response = await axios.post<{ email: string; emailVerified: boolean }>(
                `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${get("FIREBASE_API_KEY").required().asString()}`,
                {
                    oobCode: obbCode,
                }
            );

            return {
                message: "Email verificado com sucesso",
                email: response.data.email,
                emailVerified: true,
            };
        } catch (error) {
            if (error instanceof UnauthorizedException) {
                throw error;
            }
            throw new UnauthorizedException("Código de verificação inválido ou expirado");
        }
    }

    async sendPasswordResetEmail(email: string) {
        try {
            await axios.post(
                `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${get("FIREBASE_API_KEY").required().asString()}`,
                {
                    requestType: "PASSWORD_RESET",
                    email: email,
                }
            );
            return { message: "Email de redefinição de senha enviado com sucesso" };
        } catch (error) {
            if (error instanceof UnauthorizedException) {
                throw error;
            }
            throw new UnauthorizedException("Erro ao enviar email de redefinição de senha");
        }
    }

    async verifyPasswordResetCode(oobCode: string) {
        try {
            const response = await axios.post<{ email: string }>(
                `https://identitytoolkit.googleapis.com/v1/accounts:resetPassword?key=${get("FIREBASE_API_KEY").required().asString()}`,
                {
                    oobCode: oobCode,
                }
            );

            return {
                message: "Código de redefinição de senha verificado com sucesso",
                email: response.data.email,
            };
        } catch (error) {
            if (error instanceof UnauthorizedException) {
                throw error;
            }
            throw new UnauthorizedException("Código de redefinição de senha inválido ou expirado");
        }
    }

    async confirmPasswordReset(resetPasswordDto: ResetPasswordDto) {
        try {
            const response = await axios.post<{ email: string; requestType: string }>(
                `https://identitytoolkit.googleapis.com/v1/accounts:resetPassword?key=${get("FIREBASE_API_KEY").required().asString()}`,
                {
                    ...resetPasswordDto,
                }
            );

            return { message: "Senha redefinida com sucesso", data: response.data };
        } catch (error) {
            if (error instanceof UnauthorizedException) {
                throw error;
            }
            throw new UnauthorizedException("Erro ao redefinir a senha");
        }
    }
}
