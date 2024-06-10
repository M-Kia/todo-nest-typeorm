import { Module } from '@nestjs/common';
import { TodoService } from './todo.service';
import { TodoController } from './todo.controller';
import { ColumnModule } from 'src/column/column.module';

@Module({
  imports: [ColumnModule],
  providers: [TodoService],
  controllers: [TodoController],
})
export class TodoModule {}
