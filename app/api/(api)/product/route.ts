import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/server/prisma';
import { StatusCode } from '@/lib/server/status.code';
import logger from '@/lib/server/logger';
import { productSchema } from '@/lib/validations/product.validation';
import { verifySuperAdmin } from '@/lib/server/admin-middleware';

// GET all products
export async function GET(request: NextRequest) {
  logger.info('Fetching all products');
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    const category = url.searchParams.get('category');
    const type = url.searchParams.get('type');
    const search = url.searchParams.get('search');
    const stock = url.searchParams.get('stock');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const page = parseInt(url.searchParams.get('page') || '1');
    const skip = (page - 1) * limit;

    const where: any = { deletedAt: null };

    // ID filter
    if (id) {
      where.id = id;
    }

    // Category filter
    if (category) {
      where.category = category;
    }

    // Type filter
    if (type) {
      where.type = type;
    }

    // Stock filter
    if (stock !== null && stock !== undefined) {
      where.stock = stock === 'true';
    }

    if (search) {
      where.OR = [
        { product_name: { contains: search, mode: 'insensitive' } },
        { type: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { ingredients: { contains: search, mode: 'insensitive' } }
      ];
    }

    // ID filter
    if (id) {
      const product = await prisma.product.findUnique({ where: { id } });

      if (!product || product.deletedAt !== null) {
        return NextResponse.json(
          { success: false, message: 'Product not found' },
          { status: StatusCode.NOT_FOUND }
        );
      }

      return NextResponse.json(
        { success: true, data: product },
        { status: StatusCode.OK }
      );
    }


    // Fetch products with pagination
    const products = await prisma.product.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    // Get total count for pagination
    const totalCount = await prisma.product.count({ where });

    logger.info(`Fetched ${products.length} products`);
    return NextResponse.json(
      {
        success: true,
        message: 'Products fetched successfully',
        data: {
          rows: products,
          total: totalCount,
          page,
          limit,
          pages: Math.ceil(totalCount / limit),
        },
      },
      { status: StatusCode.OK }
    );
  } catch (error) {
    logger.error({ err: error }, 'Error fetching products');
    return NextResponse.json(
      {
        success: false,
        error: StatusCode.INTERNAL_SERVER_ERROR
      },
      { status: StatusCode.INTERNAL_SERVER_ERROR }
    );
  }
}

export async function POST(request: NextRequest) {
  logger.info('Product creation attempt');
  try {
    const adminResult = verifySuperAdmin(request);
    if (adminResult.error) {
      return adminResult.response;
    }

    const { admin } = adminResult;

    // Parse and validate request body
    const body = await request.json();

    const validationResult = productSchema.safeParse(body);
    if (!validationResult.success) {
      logger.warn({ errors: validationResult.error.format() }, 'Invalid product data');
      return NextResponse.json(
        { error: 'Invalid product data', details: validationResult.error.format() },
        { status: StatusCode.BAD_REQUEST }
      );
    }

    const productData = validationResult.data;

    // Create the product
    const product = await prisma.product.create({
      data: {
        product_name: productData.product_name,
        category: productData.category,
        type: productData.type,
        description: productData.description,
        ingredients: productData.ingredients,
        imageUrl: productData.imageUrl,
        sizePrice: productData.sizePrice,
        stock: productData.stock,
      },
    });

    logger.info({ productId: product.id }, 'Product created successfully');
    return NextResponse.json(
      {
        message: 'Product created successfully',
        product,
      },
      { status: StatusCode.CREATED }
    );
  } catch (error) {
    logger.error({ err: error }, 'Error creating product');
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: StatusCode.INTERNAL_SERVER_ERROR }
    );
  }
}


