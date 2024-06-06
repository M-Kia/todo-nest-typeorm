import { Module } from '@nestjs/common';
import { TodoModule } from './todo/todo.module';
import { UserModule } from './user/user.module';
import { ColumnModule } from './column/column.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: './db.sqlite',
      entities: [User],
      synchronize: true,
    }),
    TodoModule,
    UserModule,
    ColumnModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
