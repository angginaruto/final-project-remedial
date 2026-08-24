import { z } from "zod";
export declare const transactionPreviewSchema: z.ZodObject<{
    items: z.ZodArray<z.ZodObject<{
        productId: z.ZodCoercedNumber<unknown>;
        quantity: z.ZodCoercedNumber<unknown>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare const createCashTransactionSchema: z.ZodObject<{
    items: z.ZodArray<z.ZodObject<{
        productId: z.ZodCoercedNumber<unknown>;
        quantity: z.ZodCoercedNumber<unknown>;
    }, z.core.$strip>>;
    cashReceived: z.ZodCoercedNumber<unknown>;
}, z.core.$strip>;
export declare const createDebitTransactionSchema: z.ZodObject<{
    items: z.ZodArray<z.ZodObject<{
        productId: z.ZodCoercedNumber<unknown>;
        quantity: z.ZodCoercedNumber<unknown>;
    }, z.core.$strip>>;
    cardNumber: z.ZodString;
}, z.core.$strip>;
export declare const getTransactionHistorySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
}, z.core.$strip>;
//# sourceMappingURL=transaction.validation.d.ts.map