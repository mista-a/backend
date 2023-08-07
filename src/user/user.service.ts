import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { ProductEntity } from 'src/product/entities/product.entity';
import { CartItemEntity } from './entities/cartItem.entity';
import { OrderEntity } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import {
  ProductSortEnum,
  SearchProductDto,
} from 'src/product/dto/search-product.dto';
import { PaginationDto } from 'src/product/dto/pagination.dto';
import { SizeEntity } from 'src/product/entities/size.entity';
import { deleteFromCartDto } from './dto/delete-from-cart.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private user: Repository<UserEntity>,
    @InjectRepository(ProductEntity)
    private product: Repository<ProductEntity>,
    @InjectRepository(CartItemEntity)
    private cartItem: Repository<CartItemEntity>,
    @InjectRepository(OrderEntity)
    private order: Repository<OrderEntity>,
    @InjectRepository(SizeEntity)
    private size: Repository<SizeEntity>,
  ) {}

  async create(dto: CreateUserDto) {
    return this.user.save({
      email: dto.email,
      name: dto.name,
      password: dto.password,
    });
  }

  findAll() {
    return `This action returns all user`;
  }

  async findById(id: number) {
    return this.user.findOneBy({ id });
  }

  async toggleFavorite(id: number, productId: number) {
    const user = await this.user.findOne({
      where: { id },
      relations: ['favorites'],
    });

    let inFavorite = false;
    const qb = this.user.createQueryBuilder();

    for (const product of user.favorites) {
      if (product.id === productId) {
        inFavorite = true;
        await qb.relation(UserEntity, 'favorites').of(id).remove(productId);
        return;
      }
    }

    if (!inFavorite) {
      await qb.relation(UserEntity, 'favorites').of(id).add(productId);
    }
  }

  async getFavorites(id: number, query: PaginationDto) {
    const page: number = +query.page || 1;
    const limit: number = +query.limit || 12;

    const qb = this.user
      .createQueryBuilder('user')
      .where({ id })
      .leftJoinAndSelect('user.favorites', 'favorites');

    const totalProducts = (await qb.getOne()).favorites.length;
    const totalPages = Math.ceil(totalProducts / limit);

    const user = await qb
      .limit(limit)
      .offset((page - 1) * limit)
      .getOne();

    const filteredProducts = user.favorites.map((product) => {
      return { ...product, inFavorite: true };
    });

    return {
      favorites: filteredProducts,
      totalPages,
      totalProducts,
      page: +query.page || 1,
    };
  }

  async getCart(userId: number) {
    const user = await this.user.findOne({
      where: { id: userId },
      relations: ['cartItems', 'cartItems.product', 'cartItems.size'],
    });

    if (!user) throw new NotFoundException('User not found');

    return user.cartItems;
  }

  async addToCart(
    userId: number,
    productId: number,
    productCount: number,
    sizeId: number,
  ) {
    let userQueryBuilder = this.user
      .createQueryBuilder('user')
      .where({ id: userId })
      .leftJoinAndSelect('user.cartItems', 'cartItems')
      .leftJoinAndSelect('cartItems.product', 'product')
      .leftJoinAndSelect('cartItems.size', 'size');

    if (!userQueryBuilder) throw new NotFoundException('User not found');

    let user = await userQueryBuilder.getOne();

    const isPoductInCart = await userQueryBuilder
      .andWhere('size.id = :sizeId', { sizeId })
      .andWhere('product.id = :productId', { productId })
      .getOne();

    let cartItem: CartItemEntity;

    if (isPoductInCart) {
      cartItem = isPoductInCart.cartItems[0];
      cartItem.count += productCount;
      await this.cartItem.save(cartItem);
    }
    if (!isPoductInCart) {
      const size = await this.size.findOneBy({
        id: sizeId,
      });

      if (!size) throw new NotFoundException('Size not found');

      const product = await this.product.findOneBy({
        id: productId,
      });

      if (!product) throw new NotFoundException('Product not found');

      cartItem = await this.cartItem.save({
        count: productCount,
        product,
        size,
      });

      user.cartItems.push(cartItem);
      await this.user.save(user);
    }

    return cartItem;
  }

  async deleteFromCart({
    deleteProductsCounter,
    cartItemId,
  }: deleteFromCartDto) {
    const cartItem = await this.cartItem.findOne({
      where: { id: cartItemId },
      relations: ['product', 'size'],
    });

    if (!cartItem) throw new NotFoundException('Cart item not found');

    const newCartItemCounter = cartItem.count - deleteProductsCounter;
    if (newCartItemCounter <= 0) {
      this.cartItem.delete(cartItemId);
    } else {
      cartItem.count = newCartItemCounter;
      this.cartItem.save(cartItem);
    }

    return cartItem;
  }

  findByCond(cond) {
    return this.user.findOne({ where: cond });
  }

  update(id: number, dto: UpdateUserDto) {
    return this.user.update(id, dto);
  }

  async createOrder(id: number, dto: CreateOrderDto) {
    const user = await this.user.findOneBy({ id });
    if (user) {
      this.order.save({ user, ...dto });
      user.cartItems = [];
      this.user.save(user);
    }
  }

  async getLastOrderData(id: number) {
    const orders = await this.order.find({
      relations: ['user'],
      where: {
        user: {
          id,
        },
      },
    });
    return orders[orders.length - 1];
  }
}
