import { Injectable } from "@nestjs/common";
import { IUserRepository } from "./interfaces/user.repository.interface";
import { UserEntity } from "src/Entities/user.entity";
import { PrismaService } from "src/prisma.service";
import { UserDto } from "src/dtos/user.dto";

@Injectable()
export class UserRepositoy implements IUserRepository {
    
    constructor(private readonly prisma: PrismaService) {}

    findAll(): Promise<UserEntity[]> {
        return this.prisma.user.findMany();
    }

    async findUser(email: string): Promise<UserEntity> {
        if (!email) {
            throw new Error('Email must be provided');
        }
        const user = await this.prisma.user.findUnique({
            where: {
                email: email
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
                email: user.email,
                password: user.password
            },
        });
    }
}