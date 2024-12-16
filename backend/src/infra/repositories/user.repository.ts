import { Injectable } from "@nestjs/common";
import { IUserRepository } from "./interfaces/user.repository.interface";
import { UserEntity } from "src/Entities/user.entity";
import { PrismaService } from "src/prisma.service";
import { UserDto } from "src/dtos/user.dto";

@Injectable()
export class UserRepository implements IUserRepository {
    
    constructor(private readonly prisma: PrismaService) {}

    getAllUsers(): Promise<UserEntity[]> {
        return this.prisma.user.findMany();
    }

    async getUserByUsername(username: string): Promise<UserEntity> {
        try{
            return await this.prisma.user.findUnique({
                where: {
                    username: username
                }
            });
        }
        catch(error){
            throw error;
        }
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

    async getUserById(id: string): Promise<UserEntity> {
        if (!id) {
            throw new Error('id must be provided');
        }
        const user = await this.prisma.user.findUnique({
            where: {
                id: id
            }
        });
        if(!user) {
            throw new Error('User not found');
        }
        return user;
    }
}