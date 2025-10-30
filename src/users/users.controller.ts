import { Controller, Get, UseGuards } from "@nestjs/common";
import { CurrentUser, SessionCookieAuthGuard, SessionUser } from "src/auth";

@Controller("users")
export class UsersController {
    constructor() {}

    @Get("me")
    @UseGuards(SessionCookieAuthGuard)
    getMe(@CurrentUser() user: SessionUser) {
        return {
            ...user,
        };
    }
}
