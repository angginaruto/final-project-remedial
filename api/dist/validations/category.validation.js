import { z } from "zod";
export const createCategorySchema = z.object({
    name: z.string().trim().min(1, "Kategori harus terdiri dari setidaknya satu karakter").max(100, "Maksimal karakter 100")
});
export const updateCategorySchema = z.object({
    name: z.string().trim().min(1, "Kategori harus terdiri dari setidaknya satu karakter").max(100, "Maksimal karakter 100")
});
export const getCategoriesSchema = z.object({
    search: z.string().trim().optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10)
});
export const deleteConfirmationSchema = z.object({
    confirm: z.literal(true, { error: "Penghapusan harus dikonfirmasi" })
});
//# sourceMappingURL=category.validation.js.map