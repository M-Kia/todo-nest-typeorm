import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CookieSessionModule } from 'nestjs-cookie-session';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { TodoModule } from './todo/todo.module';
import { UserModule } from './user/user.module';
import { ColumnModule } from './column/column.module';
import { User } from './user/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}.local`,
      isGlobal: true,
    }),
    CookieSessionModule.forRoot({
      session: { secret: 'ailshduqkjqowhe' },
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'sqlite',
        database: `./${config.get<string>('DB_NAME')}`,
        entities: [User],
        synchronize: true,
      }),
    }),
    TodoModule,
    UserModule,
    ColumnModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
