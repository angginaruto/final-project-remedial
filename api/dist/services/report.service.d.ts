export declare const getShiftReportService: (userId: number, date?: string) => Promise<{
    shiftId: number;
    cashier: {
        email: string;
        id: number;
        name: string;
    };
    startedAt: Date;
    endedAt: Date | null;
    status: import("@prisma/client").$Enums.ShiftStatus;
    totalTransactions: number;
    totalSales: number;
    totalCash: number;
    totalDebit: number;
    initialCash: number;
    finalCash: number | null;
    expectedCash: number;
    cashDifference: number | null;
    isMismatch: boolean;
}[]>;
export declare const getDailySalesReportService: (userId: number, startDate?: string, endDate?: string) => Promise<{
    totalTransactions: number;
    totalSales: number;
    totalCash: number;
    totalDebit: number;
    date: string;
}[]>;
export declare const getDailyProductSalesReportService: (userId: number, startDate?: string, endDate?: string) => Promise<{
    productId: number;
    productName: string;
    quantitySold: number;
    totalSales: number;
    date: string | undefined;
}[]>;
export declare const getDiscrepancyReportService: (userId: number) => Promise<({
    cashier: {
        email: string;
        id: number;
        name: string;
    };
} & {
    id: number;
    cashierId: number;
    startedAt: Date;
    endedAt: Date | null;
    initialCash: import("@prisma/client-runtime-utils").Decimal;
    finalCash: import("@prisma/client-runtime-utils").Decimal | null;
    expectedCash: import("@prisma/client-runtime-utils").Decimal | null;
    cashDifference: import("@prisma/client-runtime-utils").Decimal | null;
    status: import("@prisma/client").$Enums.ShiftStatus;
})[]>;
export declare class ReportValidationError extends Error {
    constructor(message: string);
}
//# sourceMappingURL=report.service.d.ts.map