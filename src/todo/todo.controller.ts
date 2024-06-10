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

import { AuthGuard } from 'src/guards/auth.guard';
import { Serialize } from 'src/intercepters/serialize.interceptor';
import { TodoDto } from './dto/todo.dto';
import { TodoService } from './todo.service';
import { TodoCreateDto } from './dto/todo-create.dto';
import { CurrentUser } from 'src/user/decorators/current-user.decorator';
import { User } from 'src/user/user.entity';
import { TodoUpdateDto } from './dto/todo-update.dto';
import { TodoReorderDto } from './dto/todo-reorder.dto';
import { TodoChangeColumnDto } from './dto/todo-change-column.dto';

@Controller('todo')
@UseGuards(AuthGuard)
@Serialize(TodoDto)
export class TodoController {
  constructor(private readonly service: TodoService) {}

  @Post()
  async createTodo(@Body() body: TodoCreateDto, @CurrentUser() user: User) {
    return await this.service.create(body, user);
  }

  @Get()
  async findTodoList(
    @Query('description') description: string,
    @CurrentUser() user: User,
  ) {
    return await this.service.find(user, description);
  }

  @Get(':id')
  async findTodo(@Param('id') id: string, @CurrentUser() user: User) {
    const todo = await this.service.findOne(parseInt(id), user);
    if (!todo) {
      throw new NotFoundException('Todo not found');
    }

    return todo;
  }

  @Patch(':id')
  async updateTodo(
    @Param('id') id: string,
    @Body() body: TodoUpdateDto,
    @CurrentUser() user: User,
  ) {
    if (Object.keys(body).length === 0) {
      throw new BadRequestException('Nothing to change');
    }

    return await this.service.update(parseInt(id), body, user);
  }

  @Delete(':id')
  async removeTodo(@Param('id') id: string, @CurrentUser() user: User) {
    return await this.service.remove(parseInt(id), user);
  }

  @Post(':id/reorder')
  async reorderTodo(
    @Param('id') id: string,
    @Body() body: TodoReorderDto,
    @CurrentUser() user: User,
  ) {
    return await this.service.reorder(parseInt(id), body.order, user);
  }

  @Post('change-column')
  async changeColumn(
    @Body() body: TodoChangeColumnDto,
    @CurrentUser() user: User,
  ) {
    return await this.service.changeTodoColumn(body, user);
  }
}
