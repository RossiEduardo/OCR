
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '@services/user.service';
import { UserDto } from 'src/dtos/user.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  async signIn(
    username: string,
    pass: string,
  ): Promise<{ access_token: string }> {
    const user = await this.userService.getUserByUsername(username);
    if (user?.password !== pass) {
      throw new UnauthorizedException();
    }
    const payload = { userId: user.id, username: user.username };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async signUp(username: string, name: string, password: string): Promise<{success: boolean, access_token: string, message: string }> {
    const User = new UserDto();
    User.username = username;
    User.name = name;
    User.password = password;

    const userExists = await this.userService.getUserByUsername(username);
    if(userExists !== null){
      return {
        success: false,
        access_token: null,
        message: 'User already exists'
      };
    }


    try{
      const user = await this.userService.createUser(User);
      const payload = { userId: user.id, username: user.username };
      return {
        success: true,
        access_token: await this.jwtService.signAsync(payload),
        message: 'User created successfully'
      };
    }
    catch(error){
      return {
        success: false,
        access_token: null,
        message: error.message
      };
    }
  }

}
