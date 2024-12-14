import { UserDto } from "src/dtos/user.dto";
import { UserEntity } from "src/Entities/user.entity";

export interface IUserRepository {
    findAll(): Promise<UserEntity[]>;
    create(user: UserDto): Promise<UserEntity>;
    findUser(username: string): Promise<UserEntity>;
}