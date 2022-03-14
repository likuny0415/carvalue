import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './user/user.entity';
import { UserModule } from './user/user.module';
require('dotenv').config();


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.MQSQL_DATABASE_HOST,
      port: 3306,
      username: process.env.MQSQL_DATABASE_USERNAME,
      password: process.env.MQSQL_DATABASE_PASSWORD,
      database: process.env.MQSQL_DATABASE_NAME,
      entities: [User],
      synchronize: true,
    }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
