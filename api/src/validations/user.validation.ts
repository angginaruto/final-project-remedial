import {z} from "zod"

export const userSchema = z.object({
    email : z.email().min(1, "setidaknya harus ada 1 karakter email"),
    password : z.string().min(1, "setidaknya harus ada 1 karakter password")
})