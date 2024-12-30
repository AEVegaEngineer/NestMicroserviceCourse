import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Inject,
  Patch,
  ParseIntPipe,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { ClientProxy, Payload } from '@nestjs/microservices';
import { ORDERS_SERVICE } from 'src/config';

@Controller('orders')
export class OrdersController {
  constructor(
    @Inject(ORDERS_SERVICE) private readonly ordersService: ClientProxy,
  ) {}

  @Post()
  create(@Payload() createOrderDto: CreateOrderDto) {
    return this.ordersService.send('createOrder', createOrderDto);
  }

  @Get()
  findAll() {
    return this.ordersService.send('findAllOrders', {});
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.send('findOneOrder', { id });
  }

  @Patch(':id')
  chageOrderStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() changeOrderStatusDto,
  ) {
    return this.ordersService.send(
      { cmd: 'changeOrderStatus' },
      { id, ...changeOrderStatusDto },
    );
  }
}
