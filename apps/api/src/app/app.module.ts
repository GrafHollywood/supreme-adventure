import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { environment } from '../environments/environment';
import { AuthModule } from './auth/auth.module';
import { User } from './users/entity/user.entity';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: environment.postgres.host,
      port: environment.postgres.port,
      username: environment.postgres.username,
      password: environment.postgres.password,
      database: environment.postgres.database,
      entities: [User],
      synchronize: !environment.production,
    }),
    ConfigModule.forRoot(),
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}
