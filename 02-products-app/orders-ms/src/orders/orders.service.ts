import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from 'src/common/dto';
import { RpcException } from '@nestjs/microservices';
import { OrderPaginationDto } from './dto/order-pagination.dto';
import { ChangeOrderStatusDto } from './dto/change-order-status.dto';

@Injectable()
export class OrdersService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(OrdersService.name);

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Connected to database');
  }
  create(createOrderDto: CreateOrderDto) {
    return { service: 'orders', data: createOrderDto };
    // return this.order.create({ data: createOrderDto });
  }

  async findAll(orderPaginationDto: OrderPaginationDto) {
    const {
      page: currentPage,
      limit: ordersPerPage,
      status,
    } = orderPaginationDto;

    const totalOrders = await this.order.count({
      where: {
        status: status,
      },
    });
    const lastPage = Math.ceil(totalOrders / ordersPerPage);

    return {
      data: await this.order.findMany({
        take: ordersPerPage,
        skip: (currentPage - 1) * ordersPerPage,
        where: {
          status: status,
        },
      }),
      meta: {
        totalOrders,
        currentPage,
        lastPage,
      },
    };
  }

  findOne(id: string) {
    const order = this.order
      .findUniqueOrThrow({
        where: {
          id,
        },
      })
      .catch((error) => {
        this.logger.error(error);
        throw new RpcException({
          message: `Order with id #${id} not found`,
          status: HttpStatus.NOT_FOUND,
        });
      });
    return order;
  }

  async chageOrderStatus(changeOrderStatusDto: ChangeOrderStatusDto) {
    const { id, status } = changeOrderStatusDto;
    const order = await this.findOne(id);

    if (order.status === status) {
      throw new RpcException({
        message: `Order with id #${id} already has status ${status}`,
        status: HttpStatus.BAD_REQUEST,
      });
    }

    return this.order.update({
      where: { id: id },
      data: {
        status: status,
      },
    });
  }
}
