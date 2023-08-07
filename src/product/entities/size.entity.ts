import { CartItemEntity } from 'src/user/entities/cartItem.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity('size')
export class SizeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => CartItemEntity, (cartItem) => cartItem.size)
  cartItems: CartItemEntity[];
}
