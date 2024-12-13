import { UserController } from "@controllers/user.controller";
import { Module } from "@nestjs/common";
import { UserService } from "@services/user.service";
import { DatabaseModule } from "./database.module";

@Module({
    imports: [DatabaseModule],
    controllers: [UserController],
    providers: [UserService],
    exports: [],
})
export class UserModule {}