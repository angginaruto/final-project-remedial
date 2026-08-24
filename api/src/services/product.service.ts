import prisma from "../utils/prisma.js";
import { uploadToCloudinary } from "../utils/uploadImage.js";

// ============ CREATE PRODUCT ============

export const createProductService = async (
  userId: number,
  data: { name: string; price: number; stock: number; categoryId: number },
  fileBuffer?: Buffer
) => {
  const category = await prisma.category.findUnique({ where: { id: data.categoryId } });

  if (!category || category.isDeleted) {
    throw new ProductNotFoundError("kategori tidak ditemukan");
  }

  const existingProduct = await prisma.product.findFirst({ where: { name: data.name } });

  if (existingProduct) {
    if (!existingProduct.isDeleted) {
      throw new ProductConflictError("nama produk sudah ada");
    }

    const restoredProduct = await prisma.product.update({
      where: { id: existingProduct.id, createdById: userId },
      data: { isDeleted: false },
    });

    return { restored: true, product: restoredProduct };
  }

  let imageUrl: string | null = null;
  if (fileBuffer) {
    imageUrl = await uploadToCloudinary(fileBuffer, "products");
  }

  const product = await prisma.product.create({
    data: {
      name: data.name,
      price: data.price,
      stock: data.stock,
      categoryId: data.categoryId,
      createdById: userId,
      image: imageUrl,
    },
  });

  return { restored: false, product };
};

// ============ GET PRODUCTS ============

export const getProductsService = async (
  ownerAdminId: number,
  filters: { search?: string | undefined; categoryId?: number | undefined; page: number; limit: number }
) => {
  const { search, categoryId, page, limit } = filters;
  const skip = (page - 1) * limit;

  const where = {
    isDeleted: false,
    createdById: ownerAdminId,
    ...(search ? { name: { contains: search, mode: "insensitive" as const } } : {}),
    ...(categoryId ? { categoryId } : {}),
  };

  const [products, total] = await Promise.all([
    prisma.product.findMany({ where, include: { category: true }, orderBy: { createdAt: "desc" }, skip, take: limit }),
    prisma.product.count({ where }),
  ]);

  return {
    products,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
};

// ============ GET PRODUCT BY ID ============

export const getProductByIdService = async (ownerAdminId: number, id: number) => {
  const product = await prisma.product.findFirst({
    where: { id, createdById: ownerAdminId, isDeleted: false },
    include: { category: true },
  });

  if (!product) {
    throw new ProductNotFoundError("produk tidak ditemukan");
  }

  return product;
};

// ============ UPDATE PRODUCT ============

export const updateProductService = async (
  userId: number,
  id: number,
  data: {name?: string | undefined;price?: number | undefined;stock?: number | undefined;categoryId?: number | undefined}, fileBuffer?: Buffer
) => {
  const existingProduct = await prisma.product.findFirst({
    where: { id, createdById: userId, isDeleted: false },
  });

  if (!existingProduct) {
    throw new ProductNotFoundError("produk tidak ditemukan");
  }

  if (data.categoryId !== undefined) {
    const category = await prisma.category.findFirst({ where: { id: data.categoryId, isDeleted: false } });
    if (!category) {
      throw new ProductNotFoundError("kategori tidak ditemukan");
    }
  }

  let imageUrl: string | undefined;
  if (fileBuffer) {
    imageUrl = await uploadToCloudinary(fileBuffer, "products");
  }

  const updatedProduct = await prisma.product.update({
    where: { id },
    data: {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.price !== undefined && { price: data.price }),
      ...(data.stock !== undefined && { stock: data.stock }),
      ...(data.categoryId !== undefined && { categoryId: data.categoryId }),
      ...(imageUrl !== undefined && { image: imageUrl }),
    },
    include: { category: true },
  });

  return updatedProduct;
};

// ============ DELETE PRODUCT ============

export const deleteProductService = async (userId: number, id: number) => {
  const product = await prisma.product.findFirst({ where: { id, createdById: userId, isDeleted: false } });

  if (!product) {
    throw new ProductNotFoundError("produk tidak ditemukan");
  }

  await prisma.product.update({ where: { id }, data: { isDeleted: true } });
};

// Error khusus supaya controller bisa membedakan status code (404 vs 409 vs 500)
export class ProductNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ProductNotFoundError";
  }
}

export class ProductConflictError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ProductConflictError";
  }
}