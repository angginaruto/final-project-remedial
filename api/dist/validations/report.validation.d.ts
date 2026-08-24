import { z } from "zod";
export declare const dailySalesReportSchema: z.ZodObject<{
    startDate: z.ZodOptional<z.ZodString>;
    endDate: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const dailyProductSalesReportSchema: z.ZodObject<{
    startDate: z.ZodOptional<z.ZodString>;
    endDate: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
//# sourceMappingURL=report.validation.d.ts.map