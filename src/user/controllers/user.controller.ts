import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { UserUpdateDto } from '../dto/user-update.dto';
import { Serialize } from '../../intercepters/serialize.interceptor';
import { UserDto } from '../dto/user.dto';
import { UserSignupDto } from '../dto/user-signup.dto';
import { AdminGuard } from 'src/guards/admin.guard';

@Controller('user')
@Serialize(UserDto)
@UseGuards(AdminGuard)
export class UserController {
  constructor(private readonly service: UserService) {}

  @Post()
  async createUser(@Body() body: UserSignupDto) {
    return await this.service.create(body.email, body.password);
  }

  @Get()
  async findUserList(@Query('email') email: string) {
    return await this.service.find(email);
  }

  @Get(':id')
  async findUser(@Param('id') id: string) {
    const user = await this.service.findOne(parseInt(id));
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  @Patch(':id')
  async updateUser(@Param('id') id: string, @Body() body: UserUpdateDto) {
    if (Object.keys(body).length === 0) {
      throw new BadRequestException('Nothing to change');
    }

    return await this.service.update(parseInt(id), body);
  }

  @Delete(':id')
  async removeUser(@Param('id') id: string) {
    return await this.service.remove(parseInt(id));
  }
}
