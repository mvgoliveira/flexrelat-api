import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class SessionCookieAuthGuard extends AuthGuard("session-cookie") {}
