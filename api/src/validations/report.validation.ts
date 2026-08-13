import {z} from "zod"

export const dailySalesReportSchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional()
})

export const dailyProductSalesReportSchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional()
});