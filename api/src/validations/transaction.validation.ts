import {z} from "zod"

export const transactionPreviewSchema = z.object({
    items : z.array(z.object({productId:z.coerce.number().int().positive(), quantity : z.coerce.number().int().positive()})).min(1, "minimal 1 produk")
})

export const createCashTransactionSchema = z.object({
    items : z.array(z.object({productId : z.coerce.number().int().positive(), quantity:z.coerce.number().int().positive()})).min(1, "minimal 1"),
    cashReceived : z.coerce.number().positive("harus lebih dari 0")
})

export const createDebitTransactionSchema = z.object({
    items : z.array(z.object({productId : z.coerce.number().int().positive(), quantity:z.coerce.number().int().positive()})).min(1, "minimal 1 produk"),
    cardNumber : z.string().regex(/^[0-9]{16}$/, "Nomor kartu harus 16 digit")
})

export const getTransactionHistorySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
});