import { Body, ClassSerializerInterceptor, Controller, Delete, NotFoundException, Param, Post, Query, UseInterceptors } from '@nestjs/common';
import { Serialize, SerializeInterceptor } from 'src/interceptors/serialize.interceptor';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { User } from './user.entity';
import { UserService } from './user.service';

@Controller('auth')
@Serialize(User)
export class UserController {

    constructor(
        private readonly userService: UserService
    ) {}

    @Post('/signup')
    async createUser(@Body() body: CreateUserDto) {
        return await this.userService.create(body.email, body.password);
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
