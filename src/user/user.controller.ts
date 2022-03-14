import { Body, ClassSerializerInterceptor, Controller, Delete, NotFoundException, Param, Post, Query, Session, UseInterceptors } from '@nestjs/common';
import { Serialize, SerializeInterceptor } from 'src/interceptors/serialize.interceptor';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserDto } from './dtos/user.dto';
import { UserService } from './user.service';

@Controller('auth')
@Serialize(UserDto)
export class UserController {

    constructor(
        private readonly userService: UserService,
        private readonly authService: AuthService
    ) {}

    @Post('/signup')
    async createUser(@Body() body: CreateUserDto, @Session() session: any) {
        const user = await this.authService.signup(body.email, body.password)
        session.userId = user.id;
        return user
    }

    @Post('/signin')
    async signin(@Body() body: CreateUserDto, @Session() session: any) {
        const user = await this.authService.signin(body.email, body.password)
        session.userId = user.id;
        return user;
    }

    
    @Post('/findone/:id')
    async findUser(@Param('id') id: string) {
        const user = await this.userService.findOne(id);
        if (!user) {
            throw new NotFoundException("User not found");
        }
        return user
    }

    @Post("/find")
    async findAllUsers(@Query("email") email: string) {
        return await this.userService.find(email);
    }

    @Post('/remove/:id')
    async removeUser(@Param("id") id: string) {
        return await this.userService.remove(id);
    }

    @Post('/update/:id')
    async updateUser(@Param("id") id: string, @Body() body: UpdateUserDto) {
        return this.userService.update(id, body);
    }
    
}
