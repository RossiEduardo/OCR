import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UserService } from '@services/user.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { UserDto } from 'src/dtos/user.dto';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    
    @UseGuards(AuthGuard)
    @Get('/getUsers')
    getAllUsers(){
        return this.userService.getAllUsers();
    }

    @Post('/create')
    createUser(@Body() user: UserDto){
        return this.userService.createUser(user);
    }
}
