import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-custom";
import { FirebaseProvider } from "@alpha018/nestjs-firebase-auth";
import { UsersService } from "../../users/users.service";
import { Request } from "express";
import { AuthUser } from "../interfaces/auth-user.interface";

@Injectable()
export class FirebaseJwtStrategy extends PassportStrategy(Strategy, "firebase-jwt") {
    constructor(
        private readonly firebaseProvider: FirebaseProvider,
        private readonly usersService: UsersService
    ) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        super();
    }

    async validate(req: Request): Promise<AuthUser> {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new UnauthorizedException("Token não fornecido");
        }

        const token = authHeader.split(" ")[1];

        try {
            // Verificar o token com o Firebase Admin SDK
            const decodedToken = await this.firebaseProvider.auth.verifyIdToken(token);

            // Verificar se o email foi verificado
            if (!decodedToken.email_verified) {
                throw new UnauthorizedException("Email não verificado");
            }

            // Buscar o usuário no banco de dados usando o Firebase UID
            const user = await this.usersService.findByFirebaseUid(decodedToken.uid);

            if (!user) {
                throw new UnauthorizedException("Usuário não encontrado");
            }

            // Retornar o usuário completo que será anexado ao req.user
            return {
                id: user.id,
                email: user.email,
                username: user.username,
                firebaseUid: user.firebaseUid,
                emailVerified: decodedToken.email_verified,
            };
        } catch (error) {
            if (error instanceof UnauthorizedException) {
                throw error;
            }
            throw new UnauthorizedException("Token inválido ou expirado");
        }
    }
}
