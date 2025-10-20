import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { SessionUser } from "../interfaces/session-user.interface";

export const CurrentUser = createParamDecorator(
    (data: unknown, ctx: ExecutionContext): SessionUser => {
        const request = ctx.switchToHttp().getRequest<{ user: SessionUser }>();
        return request.user;
    }
);
