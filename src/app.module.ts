import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './user/user.entity';
import { UserModule } from './user/user.module';
import { ReportModule } from './report/report.module';
import { Report } from './report/report.entity';
const cookieSession = require('cookie-session')

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal:true,
      envFilePath: `.env.${process.env.NODE_ENV}`
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'mysql',
          host: config.get('MQSQL_DATABASE_HOST'),
          port: 3306,
          username: config.get('MQSQL_DATABASE_USERNAME'),
          password: config.get('MQSQL_DATABASE_PASSWORD'),
          database: config.get('MQSQL_DATABASE_NAME'),
          entities: [User, Report],
          synchronize: true,
        }
      }
    }),
    // TypeOrmModule.forRoot({
      
    // }),
    UserModule,
    ReportModule,
  ],
  controllers: [AppController],
  providers: [AppService, {
    provide: APP_PIPE,
    useValue: new ValidationPipe({
      whitelist: true
    })
  }],
})
export class AppModule {
  configure(customer: MiddlewareConsumer) {
    customer.apply( cookieSession({
      keys:["randomkey"],
    })).forRoutes('*')
  }
}
