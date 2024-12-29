import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from 'src/common/dto';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(ProductsService.name);
  onModuleInit() {
    this.$connect();
    this.logger.log('database connected');
  }
  create(createProductDto: CreateProductDto) {
    // Puedo acceder directamente a this.product ya que estoy extendiendo la clase PrismaClient
    // y dentro de prisma tengo la entidad Product
    return this.product.create({ data: createProductDto });
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;

    const totalProducts = await this.product.count();
    const lastPage = Math.ceil(totalProducts / limit);

    return {
      data: await this.product.findMany({
        take: limit,
        skip: (page - 1) * limit,
      }),
      meta: {
        totalProducts,
        page,
        lastPage,
      },
    };
  }
  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
