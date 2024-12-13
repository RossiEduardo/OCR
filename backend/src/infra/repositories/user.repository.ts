import { Injectable } from "@nestjs/common";
import { IUserRepository } from "./interfaces/user.repository.interface";
import { UserEntity } from "src/domain/user.entity";
import { PrismaService } from "src/prisma.service";

@Injectable()
export class UserRepositoy implements IUserRepository {
    
    constructor(private readonly prisma: PrismaService) {}

    async findAll(): Promise<UserEntity[]> {
        return this.prisma.user.findMany();
    }
}