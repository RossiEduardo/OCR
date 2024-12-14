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

    findAll(): Promise<UserEntity[]> {
        return this.userRepository.findAll();
    }

    findUser(username: string): Promise<UserEntity> {
        return this.userRepository.findUser(username);
    }

    createUser(user: UserDto): Promise<UserEntity> {
        return this.userRepository.create(user);
    }

}