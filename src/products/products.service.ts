import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductResponseDto } from './dto/product-response.dto';
import { Prisma } from '@prisma/client'; // Importación crucial

@Injectable() // Asegúrate de que este decorador esté presente
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  private mapToResponse(
    product: Prisma.ProductGetPayload<{}>,
  ): ProductResponseDto {
    return {
      id: product.id,
      product: {
        name: product.name,
        image: product.image,
        stock: product.stock,
      },
      category: product.category,
      unitSold: product.unitSold,
      revenue: product.revenue,
      conversion: product.conversion,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }

  async create(
    createProductDto: CreateProductDto,
  ): Promise<ProductResponseDto> {
    const { product, ...rest } = createProductDto;
    const createdProduct = await this.prisma.product.create({
      data: {
        ...product,
        ...rest,
      },
    });
    return this.mapToResponse(createdProduct);
  }

  async findAll({
    page = 1,
    limit = 10,
    category,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    search,
  }: {
    page?: number;
    limit?: number;
    category?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    search?: string;
  }): Promise<{ data: ProductResponseDto[]; total: number }> {
    const where: Prisma.ProductWhereInput = {
      // Tipo explícito añadido
      ...(category && { category }),
      ...(search && {
        name: {
          contains: search,
          mode: Prisma.QueryMode.insensitive, // Enum correcto
        },
      }),
    };

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          [sortBy]: sortOrder,
        },
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      data: products.map(this.mapToResponse),
      total,
    };
  }

  async findOne(id: number): Promise<ProductResponseDto> {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return this.mapToResponse(product);
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<ProductResponseDto> {
    const existingProduct = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    const { product, ...rest } = updateProductDto;
    const data = {
      ...(product && { ...product }),
      ...rest,
    };

    const updatedProduct = await this.prisma.product.update({
      where: { id },
      data,
    });

    return this.mapToResponse(updatedProduct);
  }

  async remove(id: number): Promise<void> {
    try {
      await this.prisma.product.delete({
        where: { id },
      });
    } catch {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
  }
}
