import { Controller, NotImplementedException } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @MessagePattern('createOrder')
  create(@Payload() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @MessagePattern('findAllOrders')
  findAll() {
    return this.ordersService.findAll();
  }

  @MessagePattern('findOneOrder')
  findOne(@Payload() id: string) {
    return this.ordersService.findOne(id);
  }

  @MessagePattern('changeOrderStatus')
  chageOrderStatus(@Payload() changeOrderStatusDto) {
    throw new NotImplementedException();
  }
}