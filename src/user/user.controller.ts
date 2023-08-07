import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from '../decorators/user.decorator';
import { addToCartDto } from './dto/add-to-cart.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { PaginationDto } from 'src/product/dto/pagination.dto';
import { deleteFromCartDto } from './dto/delete-from-cart.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@User() userId: number) {
    return this.userService.findById(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  update(@User() userId: number, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(userId, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/favorites')
  toggleFavorite(@User() id: number, @Body() data: { productId: number }) {
    return this.userService.toggleFavorite(id, data.productId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/favorites')
  getFavorites(@User() id: number, @Query() query: PaginationDto) {
    return this.userService.getFavorites(id, query);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/cart')
  getCart(@User() userId: number) {
    return this.userService.getCart(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/cart')
  addToCart(@User() userId: number, @Body() dto: addToCartDto) {
    return this.userService.addToCart(
      userId,
      dto.productId,
      dto.count,
      dto.sizeId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/cart')
  deleteFromCart(@Body() dto: deleteFromCartDto) {
    return this.userService.deleteFromCart(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/order')
  createOrder(@User() id: number, @Body() data: CreateOrderDto) {
    return this.userService.createOrder(id, data);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/order')
  getLastOrderData(@User() id: number) {
    return this.userService.getLastOrderData(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findById(+id);
  }
}
