import { Controller, Get, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CurrentUser, SessionCookieAuthGuard, SessionUser } from "src/auth";

@Controller("users")
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get("me")
    @UseGuards(SessionCookieAuthGuard)
    getMe(@CurrentUser() user: SessionUser) {
        return {
            ...user,
        };
    }
}
