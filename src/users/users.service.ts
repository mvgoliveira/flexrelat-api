import { Injectable, NotFoundException, ConflictException } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { InjectModel } from "@nestjs/sequelize";
import { UsersModel } from "./model/users";
import { CreateUser } from "./entities/createUser.entity";

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(UsersModel)
        private usersModel: typeof UsersModel
    ) {}

    async create(createUserDto: CreateUserDto): Promise<CreateUser> {
        const existingUser = await this.usersModel.findOne({
            where: { email: createUserDto.email },
        });

        if (existingUser) {
            throw new ConflictException("Email já está em uso");
        }

        const user = await this.usersModel.create({
            ...createUserDto,
            firebase_uid: createUserDto.firebaseUid,
        });

        return {
            id: user.id,
            firebaseUid: user.firebase_uid,
            username: user.username,
            email: user.email,
            createdAt: user.created_at,
        };
    }

    async findByFirebaseUid(firebaseUid: string) {
        const user = await this.usersModel.findOne({
            where: { firebase_uid: firebaseUid },
        });

        if (!user) {
            return null;
        }

        return {
            id: user.id,
            firebaseUid: user.firebase_uid,
            username: user.username,
            email: user.email,
            createdAt: user.created_at,
        };
    }

    async remove(id: string): Promise<{ message: string }> {
        const user = await this.usersModel.findByPk(id);

        if (!user) {
            throw new NotFoundException("Usuário não encontrado");
        }

        await user.destroy();

        return { message: "Usuário removido com sucesso" };
    }
}
