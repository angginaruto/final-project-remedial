export declare const createProductService: (userId: number, data: {
    name: string;
    price: number;
    stock: number;
    categoryId: number;
}, fileBuffer?: Buffer) => Promise<{
    restored: boolean;
    product: {
        id: number;
        name: string;
        isDeleted: boolean;
        createdAt: Date;
        updatedAt: Date;
        createdById: number;
        price: import("@prisma/client-runtime-utils").Decimal;
        stock: number;
        categoryId: number;
        image: string | null;
    };
}>;
export declare const getProductsService: (ownerAdminId: number, filters: {
    search?: string | undefined;
    categoryId?: number | undefined;
    page: number;
    limit: number;
}) => Promise<{
    products: ({
        category: {
            id: number;
            name: string;
            isDeleted: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: number;
        name: string;
        isDeleted: boolean;
        createdAt: Date;
        updatedAt: Date;
        createdById: number;
        price: import("@prisma/client-runtime-utils").Decimal;
        stock: number;
        categoryId: number;
        image: string | null;
    })[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}>;
export declare const getProductByIdService: (ownerAdminId: number, id: number) => Promise<{
    category: {
        id: number;
        name: string;
        isDeleted: boolean;
        createdAt: Date;
        updatedAt: Date;
    };
} & {
    id: number;
    name: string;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
    createdById: number;
    price: import("@prisma/client-runtime-utils").Decimal;
    stock: number;
    categoryId: number;
    image: string | null;
}>;
export declare const updateProductService: (userId: number, id: number, data: {
    name?: string | undefined;
    price?: number | undefined;
    stock?: number | undefined;
    categoryId?: number | undefined;
}, fileBuffer?: Buffer) => Promise<{
    category: {
        id: number;
        name: string;
        isDeleted: boolean;
        createdAt: Date;
        updatedAt: Date;
    };
} & {
    id: number;
    name: string;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
    createdById: number;
    price: import("@prisma/client-runtime-utils").Decimal;
    stock: number;
    categoryId: number;
    image: string | null;
}>;
export declare const deleteProductService: (userId: number, id: number) => Promise<void>;
export declare class ProductNotFoundError extends Error {
    constructor(message: string);
}
export declare class ProductConflictError extends Error {
    constructor(message: string);
}
//# sourceMappingURL=product.service.d.ts.map