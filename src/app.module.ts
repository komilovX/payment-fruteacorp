import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { getTypeOrmConfig } from './common/typeorm.config'
import { Orders } from './entities/order.entity'
import { Transaction } from './entities/transaction.entity'
import { Users } from './entities/user.entity'

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getTypeOrmConfig,
    }),
    TypeOrmModule.forFeature([Transaction, Orders, Users]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
