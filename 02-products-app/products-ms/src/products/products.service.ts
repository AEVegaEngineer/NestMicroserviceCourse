import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
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
    const product = this.product
      .findUniqueOrThrow({
        where: {
          id,
        },
      })
      .catch((error) => {
        this.logger.error(error);
        throw new NotFoundException(`Product with id #${id} not found`);
      });
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    if (Object.keys(updateProductDto).length === 0) {
      throw new BadRequestException('Product data is required');
    }
    try {
      const updatedProduct = await this.product.update({
        where: { id },
        data: updateProductDto,
      });

      return updatedProduct;
    } catch (error) {
      this.logger.error(error);
      if (error.code === 'P2025') {
        // https://www.prisma.io/docs/orm/reference/error-reference#p2025
        throw new NotFoundException(`Product with id #${id} not found`);
      }
      throw new InternalServerErrorException(
        `Product with id #${id} could not be updated: ${error.message}`,
      );
    }
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
