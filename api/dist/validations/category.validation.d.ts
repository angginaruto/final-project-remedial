import { z } from "zod";
export declare const createCategorySchema: z.ZodObject<{
    name: z.ZodString;
}, z.core.$strip>;
export declare const updateCategorySchema: z.ZodObject<{
    name: z.ZodString;
}, z.core.$strip>;
export declare const getCategoriesSchema: z.ZodObject<{
    search: z.ZodOptional<z.ZodString>;
    page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
}, z.core.$strip>;
export declare const deleteConfirmationSchema: z.ZodObject<{
    confirm: z.ZodLiteral<true>;
}, z.core.$strip>;
//# sourceMappingURL=category.validation.d.ts.map