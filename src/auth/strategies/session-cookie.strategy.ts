import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-custom";
import { Request } from "express";
import { FirebaseProvider } from "@alpha018/nestjs-firebase-auth";
import { SessionUser } from "../interfaces/session-user.interface";
import { UsersService } from "src/users/users.service";

@Injectable()
export class SessionCookieStrategy extends PassportStrategy(Strategy, "session-cookie") {
    constructor(
        private readonly firebaseProvider: FirebaseProvider,
        private readonly usersService: UsersService
    ) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        super();
    }

    async validate(req: Request): Promise<SessionUser> {
        const sessionCookie = req.cookies?.session as string | undefined;

        if (!sessionCookie) {
            throw new UnauthorizedException("Session cookie não encontrado");
        }

        try {
            const decodedClaims = await this.firebaseProvider.auth.verifySessionCookie(
                sessionCookie,
                true // checkRevoked
            );

            if (!decodedClaims.email_verified) {
                throw new UnauthorizedException("Email não verificado");
            }

            const user = await this.usersService.findByFirebaseUid(decodedClaims.uid);

            if (!user) {
                throw new UnauthorizedException("Usuário não encontrado");
            }

            return {
                id: user.id,
                uid: decodedClaims.uid,
                username: user.username,
                email: user.email,
                emailVerified: decodedClaims.email_verified,
            };
        } catch {
            throw new UnauthorizedException("Session cookie inválido ou expirado");
        }
    }
}
