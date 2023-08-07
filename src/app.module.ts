import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserModule } from './user/user.module';
import { ProductModule } from './product/product.module';
import { ProductEntity } from './product/entities/product.entity';
import { AuthModule } from './auth/auth.module';
import { CategoryEntity } from './product/entities/category.entity';
import { SubcategoryEntity } from './product/entities/subсategory.entity';
import { CartItemEntity } from './user/entities/cartItem.entity';
import { OrderEntity } from './user/entities/order.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url:
        process.env.DATABASE_URL ||
        'postgres://postgres:1234@localhost:5432/shop',
      autoLoadEntities: true,
      synchronize: true,
      entities: [
        UserEntity,
        ProductEntity,
        CategoryEntity,
        SubcategoryEntity,
        CartItemEntity,
        OrderEntity,
      ],
    }),
    UserModule,
    ProductModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
