import { Module } from "@nestjs/common";
import { UserService } from "@services/user.service";
import { DatabaseModule } from "./database.module";
import { UserRepository } from "../repositories/user.repository";

@Module({
    imports: [DatabaseModule],
    providers: [
        UserService,
        {
            provide: 'USER_REPOSITORY',
            useClass: UserRepository
        }
    ],
    exports: [UserService],
})
export class UserModule {}