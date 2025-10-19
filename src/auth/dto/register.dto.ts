import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";
import { Matches, MaxLength } from "class-validator";

export class RegisterDto {
    @IsString()
    @IsNotEmpty()
    username: string;

    @IsEmail({}, { message: "Email inválido" })
    @IsNotEmpty({ message: "Email é obrigatório" })
    email: string;

    @IsString({ message: "Senha deve ser uma string" })
    @IsNotEmpty({ message: "Senha é obrigatória" })
    @MinLength(6, { message: "Senha deve ter no mínimo 6 caracteres" })
    @MaxLength(50, { message: "Senha deve ter no máximo 50 caracteres" })
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
        message:
            "Senha deve conter pelo menos uma letra maiúscula, uma minúscula, um número e um caractere especial",
    })
    password: string;
}
