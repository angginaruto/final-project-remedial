import {z} from "zod"

export const startShiftSchema = z.object({
    initialCash : z.coerce.number().min(0, "Uang awal tidak boleh negatif")
})

export const endShiftSchema = z.object({
    finalCash : z.coerce.number().min(0, "Uang tidak boleh negatif")
})
