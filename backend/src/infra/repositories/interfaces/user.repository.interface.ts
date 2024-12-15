import { UserDto } from "src/dtos/user.dto";
import { UserEntity } from "src/Entities/user.entity";

export interface IUserRepository {
    getAllUsers(): Promise<UserEntity[]>;
    create(user: UserDto): Promise<UserEntity>;
    getUserByUsername(username: string): Promise<UserEntity>;
}