import { Controller, Get } from '@nestjs/common';
import { UserService } from '@services/user.service';
import { Request, Response } from 'express';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}
    @Get()
    findAll(){
        return this.userService.findAll();
    }
}
