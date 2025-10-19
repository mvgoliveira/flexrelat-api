import { FirebaseAdminModule } from "@alpha018/nestjs-firebase-auth";
import { ExtractJwt } from "passport-jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";

const FirebaseConfig = FirebaseAdminModule.forRootAsync({
    imports: [ConfigModule],
    useFactory: (configService: ConfigService) => ({
        base64: configService.get("FIREBASE_SERVICE_ACCOUNT_BASE64"),
        options: {},
        auth: {
            config: {
                extractor: ExtractJwt.fromAuthHeaderAsBearerToken(),
                checkRevoked: true,
                validateRole: true,
            },
        },
    }),
    inject: [ConfigService],
});

export { FirebaseConfig };
