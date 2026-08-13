import {z} from "zod"

export const createCashierSchema = z.object({
    name : z.string().trim().min(1, "Nama harus setidaknya satu karakter").max(100),
    email : z.email("Email tidak valid"),
    password : z.string().min(6, "Password minimal 6 karakter").max(100)
})

export const updateCashierSchema = z.object({
    name : z.string().trim().min(1, "Nama harus setidaknya satu karakter").max(100).optional(),
    email : z.email("Email tidak valid").optional(),
    password : z.string().min(6, "Password minumal 6 karakter").max(100).optional()
})

export const getCashierSchema = z.object({
    search : z.string().trim().optional(),
    page : z.coerce.number().int().positive().default(1),
    limit : z.coerce.number().int().positive().max(100).default(10)
})