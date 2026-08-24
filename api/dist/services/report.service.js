import prisma from "../utils/prisma.js";
// ============ SHIFT REPORT ============
export const getShiftReportService = async (userId, date) => {
    let dateFilter = {};
    if (typeof date === "string" && date !== "") {
        const startOfDay = new Date(`${date}T00:00:00.000`);
        const endOfDay = new Date(`${date}T23:59:59.999`);
        dateFilter = { startedAt: { gte: startOfDay, lte: endOfDay } };
    }
    const shifts = await prisma.shift.findMany({
        where: { cashier: { createdById: userId }, ...dateFilter },
        include: {
            cashier: { select: { id: true, name: true, email: true } },
            transactions: { select: { id: true, totalAmount: true, paymentMethod: true } },
        },
        orderBy: { startedAt: "desc" },
    });
    return shifts.map((shift) => {
        let totalCash = 0;
        let totalDebit = 0;
        for (const transaction of shift.transactions) {
            const amount = Number(transaction.totalAmount);
            if (transaction.paymentMethod === "CASH")
                totalCash += amount;
            if (transaction.paymentMethod === "DEBIT")
                totalDebit += amount;
        }
        const totalTransactions = shift.transactions.length;
        const totalSales = totalCash + totalDebit;
        const initialCash = Number(shift.initialCash);
        const finalCash = shift.finalCash !== null ? Number(shift.finalCash) : null;
        const expectedCash = initialCash + totalCash;
        const cashDifference = finalCash !== null ? finalCash - expectedCash : null;
        return {
            shiftId: shift.id,
            cashier: shift.cashier,
            startedAt: shift.startedAt,
            endedAt: shift.endedAt,
            status: shift.status,
            totalTransactions,
            totalSales,
            totalCash,
            totalDebit,
            initialCash,
            finalCash,
            expectedCash,
            cashDifference,
            isMismatch: finalCash !== null ? cashDifference !== 0 : false,
        };
    });
};
// ============ DAILY SALES REPORT ============
export const getDailySalesReportService = async (userId, startDate, endDate) => {
    const where = { cashier: { createdById: userId } };
    if (startDate || endDate) {
        where.createdAt = {};
        if (startDate) {
            const start = new Date(startDate);
            if (isNaN(start.getTime())) {
                throw new ReportValidationError("startDate tidak valid");
            }
            start.setHours(0, 0, 0, 0);
            where.createdAt.gte = start;
        }
        if (endDate) {
            const end = new Date(endDate);
            if (isNaN(end.getTime())) {
                throw new ReportValidationError("endDate tidak valid");
            }
            end.setHours(23, 59, 59, 999);
            where.createdAt.lte = end;
        }
    }
    const transactions = await prisma.transaction.findMany({
        where,
        select: { id: true, totalAmount: true, paymentMethod: true, createdAt: true },
        orderBy: { createdAt: "asc" },
    });
    const dailyMap = new Map();
    for (const transaction of transactions) {
        const date = transaction.createdAt.toISOString().split("T")[0];
        if (!date)
            continue;
        if (!dailyMap.has(date)) {
            dailyMap.set(date, { totalTransactions: 0, totalSales: 0, totalCash: 0, totalDebit: 0 });
        }
        const daily = dailyMap.get(date);
        const amount = Number(transaction.totalAmount);
        daily.totalTransactions += 1;
        daily.totalSales += amount;
        if (transaction.paymentMethod === "CASH")
            daily.totalCash += amount;
        if (transaction.paymentMethod === "DEBIT")
            daily.totalDebit += amount;
    }
    return Array.from(dailyMap.entries()).map(([date, data]) => ({ date, ...data }));
};
// ============ DAILY PRODUCT SALES REPORT ============
export const getDailyProductSalesReportService = async (userId, startDate, endDate) => {
    const where = { transaction: { cashier: { createdById: userId } } };
    if (startDate || endDate) {
        where.transaction.createdAt = {};
        if (startDate) {
            const start = new Date(startDate);
            if (isNaN(start.getTime())) {
                throw new ReportValidationError("startDate tidak valid");
            }
            start.setHours(0, 0, 0, 0);
            where.transaction.createdAt.gte = start;
        }
        if (endDate) {
            const end = new Date(endDate);
            if (isNaN(end.getTime())) {
                throw new ReportValidationError("endDate tidak valid");
            }
            end.setHours(23, 59, 59, 999);
            where.transaction.createdAt.lte = end;
        }
    }
    const items = await prisma.transactionItem.findMany({
        where,
        select: {
            quantity: true,
            price: true,
            subtotal: true,
            product: { select: { id: true, name: true } },
            transaction: { select: { createdAt: true } },
        },
        orderBy: { transaction: { createdAt: "asc" } },
    });
    const dailyMap = new Map();
    for (const item of items) {
        const date = item.transaction.createdAt.toISOString().split("T")[0];
        if (!date)
            continue;
        const key = `${date}|${item.product.id}`;
        if (!dailyMap.has(key)) {
            dailyMap.set(key, {
                productId: item.product.id,
                productName: item.product.name,
                quantitySold: 0,
                totalSales: 0,
            });
        }
        const daily = dailyMap.get(key);
        daily.quantitySold += item.quantity;
        daily.totalSales += Number(item.subtotal);
    }
    return Array.from(dailyMap.entries()).map(([key, data]) => {
        const [date] = key.split("|");
        return { date, ...data };
    });
};
// ============ DISCREPANCY REPORT ============
export const getDiscrepancyReportService = async (userId) => {
    return prisma.shift.findMany({
        where: {
            status: "CLOSED",
            cashDifference: { not: 0 },
            cashier: { createdById: userId },
        },
        include: {
            cashier: { select: { id: true, name: true, email: true } },
        },
        orderBy: { endedAt: "desc" },
    });
};
// Error khusus untuk validasi tanggal di dalam service,
// supaya controller bisa membedakan 400 vs 500
export class ReportValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = "ReportValidationError";
    }
}
//# sourceMappingURL=report.service.js.map