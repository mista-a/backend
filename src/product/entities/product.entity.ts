import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { ProductColor } from '../types/ProductColor';
import { CategoryEntity } from './category.entity';
import { SubcategoryEntity } from './subсategory.entity';
import { CartItemEntity } from 'src/user/entities/cartItem.entity';
import { SizeEntity } from './size.entity';
import { Transform } from 'class-transformer';
import { ColumnNumericTransformer } from 'src/transformers/columnNumeric.transformer';

@Entity('product')
export class ProductEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  previewImg: string;

  @Column('jsonb')
  imgs: string[];

  @Column({ default: 0 })
  views: number;

  @Column('decimal', {
    default: 0,
    precision: 6,
    scale: 2,
    transformer: new ColumnNumericTransformer(),
  })
  @Transform(({ value }) => parseFloat(value))
  price: number;

  @ManyToOne(() => CategoryEntity)
  category: CategoryEntity;

  @ManyToOne(() => SubcategoryEntity)
  subcategory: SubcategoryEntity;

  @ManyToMany(() => ProductEntity)
  @JoinTable({ joinColumn: { name: 'productId_1' } })
  simularProducts: ProductEntity[];

  @OneToMany(() => CartItemEntity, (cartItem) => cartItem.product)
  cartItems: CartItemEntity[];

  @Column({ default: false })
  inFavorite: boolean;

  @ManyToMany(() => SizeEntity)
  @JoinTable()
  sizes: SizeEntity[];

  @Column('jsonb', { nullable: false })
  color: ProductColor;
}
