import { Injectable } from "@nestjs/common";
import { IUserRepository } from "./interfaces/user.repository.interface";
import { UserEntity } from "src/Entities/user.entity";
import { PrismaService } from "src/prisma.service";
import { UserDto } from "src/dtos/user.dto";

@Injectable()
export class UserRepositoy implements IUserRepository {
    
    constructor(private readonly prisma: PrismaService) {}

    getAllUsers(): Promise<UserEntity[]> {
        return this.prisma.user.findMany();
    }

    async getUserByUsername(username: string): Promise<UserEntity> {
        if (!username) {
            throw new Error('username must be provided');
        }
        const user = await this.prisma.user.findUnique({
            where: {
                username: username
            }
        });
        if(!user) {
            throw new Error('User not found');
        }
        return user;
    }

    create(user: UserDto): Promise<UserEntity> {
        return this.prisma.user.create({
            data: {
                name: user.name,
                username: user.username,
                password: user.password
            },
        });
    }
}