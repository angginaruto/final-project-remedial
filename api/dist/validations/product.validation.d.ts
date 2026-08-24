import { z } from "zod";
export declare const createProductSchema: z.ZodObject<{
    name: z.ZodString;
    price: z.ZodCoercedNumber<unknown>;
    stock: z.ZodCoercedNumber<unknown>;
    categoryId: z.ZodCoercedNumber<unknown>;
}, z.core.$strip>;
export declare const getProductsSchema: z.ZodObject<{
    search: z.ZodOptional<z.ZodString>;
    categoryId: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
}, z.core.$strip>;
export declare const updateProductSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    price: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    stock: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    categoryId: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
}, z.core.$strip>;
export declare const deleteConfirmationSchema: z.ZodObject<{
    confirm: z.ZodLiteral<true>;
}, z.core.$strip>;
//# sourceMappingURL=product.validation.d.ts.map