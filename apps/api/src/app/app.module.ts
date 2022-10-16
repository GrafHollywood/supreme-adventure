import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://45.141.101.238:27017/supreme-adventure'),
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}
