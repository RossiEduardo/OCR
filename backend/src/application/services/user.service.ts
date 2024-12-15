import { Inject, Injectable } from "@nestjs/common";
import { UserDto } from "src/dtos/user.dto";
import { UserEntity } from "src/Entities/user.entity";
import { IUserRepository } from "src/infra/repositories/interfaces/user.repository.interface";

@Injectable()
export class UserService {
    constructor(
        @Inject('USER_REPOSITORY')
        private readonly userRepository: IUserRepository,
    ){}

    getAllUsers(): Promise<UserEntity[]> {
        return this.userRepository.getAllUsers();
    }

    getUserByUsername(username: string): Promise<UserEntity> {
        return this.userRepository.getUserByUsername(username);
    }

    getUserById(id: string): Promise<UserEntity> {
        return this.userRepository.getUserById(id);
    }

    createUser(user: UserDto): Promise<UserEntity> {
        return this.userRepository.create(user);
    }

}