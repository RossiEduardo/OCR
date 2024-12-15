import { Module } from "@nestjs/common";
import { UserService } from "@services/user.service";
import { DatabaseModule } from "./database.module";
import { UserRepositoy } from "../repositories/user.repository";

@Module({
    imports: [DatabaseModule],
    providers: [
        UserService,
        {
            provide: 'USER_REPOSITORY',
            useClass: UserRepositoy
        }
    ],
    exports: [UserService],
})
export class UserModule {}