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
} from '@nestjs/common';
import { ColumnCreateDto } from './dto/column-create.dto';
import { CurrentUser } from 'src/user/decorators/current-user.decorator';
import { User } from 'src/user/user.entity';
import { ColumnService } from './column.service';
import { ColumnUpdateDto } from './dto/column-update.dto';

@Controller('column')
export class ColumnController {
  constructor(private readonly service: ColumnService) {}

  @Post()
  async createColumn(@Body() body: ColumnCreateDto, @CurrentUser() user: User) {
    return await this.service.create(body, user);
  }

  @Get()
  async findColumnList(
    @Query('title') title: string,
    @CurrentUser() user: User,
  ) {
    return await this.service.find(user, title);
  }

  @Get(':id')
  async findColumn(@Param('id') id: string, @CurrentUser() user: User) {
    const column = this.service.findOne(parseInt(id), user);
    if (!column) {
      throw new NotFoundException('Column not found!');
    }

    return column;
  }

  @Patch(':id')
  async updateColumn(
    @Param('id') id: string,
    @Body() body: ColumnUpdateDto,
    @CurrentUser() user: User,
  ) {
    if (Object.keys(body).length === 0) {
      throw new BadRequestException('Nothing to change');
    }

    return await this.service.update(parseInt(id), body, user);
  }

  @Delete(':id')
  async deleteColumn(@Param('id') id: string, @CurrentUser() user: User) {
    return await this.service.remove(parseInt(id), user);
  }
}
