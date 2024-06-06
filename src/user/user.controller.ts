import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { UserSignupDto } from './dto/user-signup.dto';
import { UserService } from './user.service';
import { UserUpdateDto } from './dto/user-update.dto';
import { SerializeInterceptor } from 'src/intercepters/serialize.interceptor';

@Controller('user')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Post('signup')
  createUser(@Body() body: UserSignupDto) {
    this.service.create(body);
  }

  @UseInterceptors(SerializeInterceptor)
  @Get()
  findAllUsers(@Query('email') email: string) {
    console.log('handler is running');
    return this.service.find(email);
  }

  @UseInterceptors(SerializeInterceptor)
  @Get(':id')
  findUser(@Param('id') id: string) {
    return this.service.findOne(parseInt(id));
  }

  @Patch(':id')
  updateUser(@Param('id') id: string, @Body() body: UserUpdateDto) {
    return this.service.update(parseInt(id), body);
  }

  @Delete(':id')
  removeUser(@Param('id') id: string) {
    return this.service.remove(parseInt(id));
  }
}
