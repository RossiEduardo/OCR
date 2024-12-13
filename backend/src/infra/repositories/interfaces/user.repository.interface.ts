import { UserEntity } from "src/domain/user.entity";

export interface IUserRepository {
    findAll(): Promise<UserEntity[]>;
}