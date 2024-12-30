import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, firstValueFrom, throwError } from 'rxjs';
import { PaginationDto } from 'src/common/dto';
import { PRODUCTS_SERVICE } from 'src/config';

@Controller('products')
export class ProductsController {
  constructor(
    @Inject(PRODUCTS_SERVICE) private readonly productsService: ClientProxy,
  ) {}
  @Post()
  createProduct(@Body() createProductDto) {
    return 'Crea un producto';
    // { cmd: 'create_product' }
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.productsService.send(
      { cmd: 'find_all_products' },
      { /*limit: 50 , page: 2*/ ...paginationDto },
    );
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: string) {
    // Se puede trabajar con Observables
    // return this.productsService
    //   .send({ cmd: 'find_product_by_id' }, { id })
    //   .pipe(
    //     catchError((error) => {
    //       throw new RpcException(error);
    //     }),
    //   );

    try {
      const product = await firstValueFrom(
        this.productsService.send({ cmd: 'find_product_by_id' }, { id }),
      );
      return product;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto) {
    // { cmd: 'update_product' }
    return 'Actualiza un producto';
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    //{ cmd: 'delete_product' }
    return 'Elimina un producto';
  }

  @Delete('soft/:id')
  softRemove(@Param('id') id: string) {
    //{ cmd: 'soft_delete_product' }
    return 'Desactiva un producto';
  }
}
