import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Inject,
  Patch,
  ParseIntPipe,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { ClientProxy, Payload, RpcException } from '@nestjs/microservices';
import { ORDERS_SERVICE } from 'src/config';
import { CreateOrderDto, OrderPaginationDto } from './dto';
import { firstValueFrom } from 'rxjs';

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
  findAll(@Query() orderPaginationDto: OrderPaginationDto) {
    return this.ordersService.send('findAllOrders', {
      /*limit: 50 , page: 2*/ ...orderPaginationDto,
    });
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    try {
      const order = await firstValueFrom(
        this.ordersService.send('findOneOrder', { id }),
      );
      return order;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Patch(':id')
  chageOrderStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() changeOrderStatusDto,
  ) {
    return this.ordersService.send(
      { cmd: 'changeOrderStatus' },
      { id, ...changeOrderStatusDto },
    );
  }
}
