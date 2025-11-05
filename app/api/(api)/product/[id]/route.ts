import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/server/prisma'
import { StatusCode } from '@/lib/server/status.code'
import logger from '@/lib/server/logger'
import { productSchema } from '@/lib/validations/product.validation'
import { verifySuperAdmin } from '@/lib/server/admin-middleware'

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  
  const { id } = await context.params;
  logger.info({ id }, 'Product update attempt');

  try {
    const adminResult = verifySuperAdmin(request)
    if (adminResult.error) return adminResult.response

    const body = await request.json()
    const validationResult = productSchema.partial().safeParse(body)
    if (!validationResult.success) {
      logger.warn({ errors: validationResult.error.format() }, 'Invalid product update data')
      return NextResponse.json(
        { error: 'Invalid product data', details: validationResult.error.format() },
        { status: StatusCode.BAD_REQUEST }
      )
    }

    const productData = validationResult.data

    const existingProduct = await prisma.product.findUnique({ where: { id } })
    if (!existingProduct || existingProduct.deletedAt !== null) {
      return NextResponse.json(
        { success: false, message: 'Product not found' },
        { status: StatusCode.NOT_FOUND }
      )
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: productData,
    })

    logger.info({ productId: id }, 'Product updated successfully')
    return NextResponse.json(
      {
        message: 'Product updated successfully',
        data: updatedProduct,
      },
      { status: StatusCode.OK }
    )
  } catch (error) {
    logger.error({ err: error }, 'Error updating product')
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: StatusCode.INTERNAL_SERVER_ERROR }
    )
  }
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params
  logger.info({ id }, 'Product delete attempt')

  try {
    const adminResult = verifySuperAdmin(request)
    if (adminResult.error) return adminResult.response

    const existingProduct = await prisma.product.findUnique({ where: { id } })
    if (!existingProduct || existingProduct.deletedAt !== null) {
      return NextResponse.json(
        { success: false, message: 'Product not found' },
        { status: StatusCode.NOT_FOUND }
      )
    }

    await prisma.product.update({
      where: { id },
      data: { deletedAt: new Date() },
    })

    logger.info({ productId: id }, 'Product deleted successfully')
    return NextResponse.json(
      { message: 'Product deleted successfully' },
      { status: StatusCode.OK }
    )
  } catch (error) {
    logger.error({ err: error }, 'Error deleting product')
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: StatusCode.INTERNAL_SERVER_ERROR }
    )
  }
}
