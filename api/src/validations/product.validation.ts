import {z} from "zod"

export const createProductSchema = z.object({
    name : z.string().trim().min(1, "Nama produk wajib diisi").max(100, "Nama produk maksimal 100 karakter"),
    price : z.number().positive("Harga harus lebih dari 0"),
    stock : z.number().int("Stock harus berupa bilangan bulat").min(0, "Stock tidak boleh minus"),
    categoryId : z.number().int().positive("Category ID tidak valid")
})

export const getProductsSchema = z.object({
    search : z.string().trim().optional(),
    categoryId : z.coerce.number().int().positive().optional(),
    page : z.coerce.number().int().positive().default(1),
    limit : z.coerce.number().int().positive().max(100).default(10)
})

export const updateProductSchema = z.object({
    name : z.string().trim().min(1, "Nama wajib diisi ya~").max(100, "Nama produk maksimal 100 karakter").optional(),
    price : z.number().positive("Harga harus lebih dari 0").optional(),
    stock : z.number().int("Stock harus berupa angka bilangan bulat").min(0, "Stock tidak boleh negatif").optional(),
    categoryId : z.number().int("Category ID harus bilangan bulat").positive("Category ID-nya tidak valid").optional()
})

export const deleteConfirmationSchema = z.object({
    confirm: z.literal(true, {error: "Penghapusan harus dikonfirmasi" })})