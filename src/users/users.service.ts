import { Injectable, NotFoundException, ConflictException } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { InjectModel } from "@nestjs/sequelize";
import { UsersModel } from "./model/users";
import * as bcrypt from "bcrypt";
import { User } from "./entities/user.entity";
import { CreateUser } from "./entities/createUser.entity";

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(UsersModel)
        private usersModel: typeof UsersModel
    ) {}

    async create(createUserDto: CreateUserDto): Promise<CreateUser> {
        const existingUser = await this.usersModel.findOne({
            where: { email: createUserDto.email }
        });

        if (existingUser) {
            throw new ConflictException("Email já está em uso");
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(createUserDto.password, saltRounds);

        const user = await this.usersModel.create({
            ...createUserDto,
            password: hashedPassword,
        });

        return {
            id: user.id,
            username: user.username,
            email: user.email,
            createdAt: user.createdAt,
        };
    }

    async findByEmail(email: string): Promise<UsersModel | null> {
        return await this.usersModel.findOne({
            where: { email }
        });
    }

    async remove(id: number): Promise<void> {
        const user = await this.usersModel.findByPk(id);

        if (!user) {
            throw new NotFoundException("Usuário não encontrado");
        }

        await user.destroy();
    }

    async validatePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }
}
