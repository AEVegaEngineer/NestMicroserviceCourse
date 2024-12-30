import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { PRODUCTS_SERVICE } from 'src/config';

@Controller('products')
export class ProductsController {
  constructor(
    @Inject(PRODUCTS_SERVICE) private readonly productsService: ClientProxy,
  ) {}
  @Post()
  createProduct(@Body() createProductDto) {
    return 'Crea un producto';
  }

  @Get()
  findAll() {
    return this.productsService.send({ cmd: 'find_all_products' }, {});
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return 'Obtiene un producto';
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto) {
    return 'Actualiza un producto';
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return 'Elimina un producto';
  }

  @Delete('soft/:id')
  softRemove(@Param('id') id: string) {
    return 'Desactiva un producto';
  }
}
