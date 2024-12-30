import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';

@Controller('products')
export class ProductsController {
  constructor() {}
  @Post()
  createProduct(@Body() createProductDto) {
    return 'Crea un producto';
  }

  @Get()
  findAll() {
    return 'Lista todos los productos';
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
