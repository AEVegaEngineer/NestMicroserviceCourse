import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from 'src/common/dto';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class OrdersService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(OrdersService.name);

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Connected to database');
  }
  create(createOrderDto: CreateOrderDto) {
    return this.order.create({ data: createOrderDto });
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;

    const totalOrders = await this.order.count();
    const lastPage = Math.ceil(totalOrders / limit);

    return {
      data: await this.order.findMany({
        take: limit,
        skip: (page - 1) * limit,
      }),
      meta: {
        totalOrders,
        page,
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
}
