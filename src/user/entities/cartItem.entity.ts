import { ProductEntity } from 'src/product/entities/product.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { UserEntity } from './user.entity';
import { SizeEntity } from 'src/product/entities/size.entity';

@Entity('cartItem')
export class CartItemEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  count: number;

  @ManyToOne(() => SizeEntity, (size) => size.cartItems)
  size: SizeEntity;

  @ManyToOne(() => ProductEntity, (product) => product.cartItems)
  product: ProductEntity;

  @ManyToOne(() => UserEntity, (user) => user.cartItems)
  user: UserEntity;
}
