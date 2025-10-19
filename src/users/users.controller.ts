import { Controller, Post, Body, Param, Delete, Get, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { FirebaseJwtAuthGuard } from "../auth/guards/firebase-jwt-auth.guard";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { AuthUser } from "../auth/interfaces/auth-user.interface";

@Controller("users")
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post()
    create(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto);
    }

    // Exemplo de rota protegida usando o guard
    @Get("me")
    @UseGuards(FirebaseJwtAuthGuard)
    getMe(@CurrentUser() user: AuthUser) {
        return {
            user,
        };
    }

    @Delete(":id")
    remove(@Param("id") id: string) {
        return this.usersService.remove(id);
    }
}
