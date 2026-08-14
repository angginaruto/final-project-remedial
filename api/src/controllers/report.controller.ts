import { type Request, type Response } from "express";
import prisma from "../utils/prisma.js";
import { dailySalesReportSchema, dailyProductSalesReportSchema} from "../validations/report.validation.js"

export const getShiftReport = async (req: Request,res: Response) => {
  try {
    const shifts = await prisma.shift.findMany({
      include: {cashier: {select: {id: true,name: true,email: true}},
      transactions: {select: {id: true, totalAmount: true, paymentMethod: true}}},
      orderBy: {startedAt: "desc"}});

    const report = shifts.map((shift) => {
      let totalCash = 0;
      let totalDebit = 0;

      for (const transaction of shift.transactions) {
        const amount = Number(transaction.totalAmount);

        if (transaction.paymentMethod === "CASH") {totalCash += amount}

        if (transaction.paymentMethod === "DEBIT") {totalDebit += amount}
      }

      const totalTransactions = shift.transactions.length;

      const totalSales = totalCash + totalDebit;

      const initialCash = Number(shift.initialCash);

      const finalCash = shift.finalCash !== null? Number(shift.finalCash) : null;

      const expectedCash = initialCash + totalCash;

      const cashDifference = finalCash !== null ? finalCash - expectedCash : null;

      return {
        shiftId: shift.id, cashier: shift.cashier, startedAt: shift.startedAt,
        endedAt: shift.endedAt, status: shift.status, totalTransactions, totalSales, totalCash,
        totalDebit, initialCash, finalCash, expectedCash, cashDifference, 
        isMismatch: finalCash !== null ? cashDifference !== 0 : false,
      };
    });

    return res.status(200).json({message: "Shift report berhasil diambil", data: report });

  } catch (error) {
    console.error(error);

    return res.status(500).json({message: "Terjadi error di internal server"})
  }
};

export const getDailySalesReport = async (req: Request,res: Response) => {
  try {
    const validation = dailySalesReportSchema.safeParse(req.query);

    if (!validation.success) {return res.status(400).json({message: "Query parameter tidak valid", errors: validation.error.flatten()})}

    const { startDate, endDate } = validation.data;

    const where: any = {};

    if (startDate || endDate) {
      where.createdAt = {}
      if (startDate) {
        const start = new Date(startDate);

        if (isNaN(start.getTime())) {return res.status(400).json({ message: "startDate tidak valid"})}

        start.setHours(0, 0, 0, 0);

        where.createdAt.gte = start;
      }

      if (endDate) {
        const end = new Date(endDate);
        if (isNaN(end.getTime())) {return res.status(400).json({message: "endDate tidak valid"})}

        end.setHours(23, 59, 59, 999);

        where.createdAt.lte = end;
      }
    }

    const transactions =
      await prisma.transaction.findMany({
        where, select: {id: true, totalAmount: true, paymentMethod: true, createdAt: true},
        orderBy: {createdAt: "asc"}});

    const dailyMap = new Map<string,{totalTransactions: number;totalSales: number;totalCash: number;totalDebit: number;}>();

    for (const transaction of transactions) {
      const date = transaction.createdAt.toISOString().split("T")[0];

      if (!date) {continue;}

      if (!dailyMap.has(date)) {dailyMap.set(date, {totalTransactions: 0,totalSales: 0,totalCash: 0,totalDebit: 0});}

      const daily = dailyMap.get(date)!;

      const amount = Number(transaction.totalAmount);

      daily.totalTransactions += 1;
      daily.totalSales += amount;

      if ( transaction.paymentMethod === "CASH") {daily.totalCash += amount}

      if ( transaction.paymentMethod === "DEBIT") {daily.totalDebit += amount;}
    }

    const report = Array.from(dailyMap.entries()).map(([date, data]) => ({date,...data}));

    return res.status(200).json({message: "Daily sales report berhasil diambil",data: report});

  } catch (error) {
    console.error(error);
    return res.status(500).json({message: "Terjadi error di internal server"}) }
};

export const getDailyProductSalesReport = async (req: Request, res: Response) => {
  try {
    const validation = dailyProductSalesReportSchema.safeParse(req.query);

    if (!validation.success) {return res.status(400).json({ message: "Query parameter tidak valid", errors: validation.error.flatten()})}

    const { startDate, endDate } = validation.data;

    const where: any = {};

    if (startDate || endDate) {
      where.transaction = { createdAt: {}};
      if (startDate) {
        const start = new Date(startDate);
        if (isNaN(start.getTime())) {return res.status(400).json({ message: "startDate tidak valid"})}

        start.setHours(0, 0, 0, 0);

        where.transaction.createdAt.gte = start;
      }

      if (endDate) {
        const end = new Date(endDate);
        if (isNaN(end.getTime())) {return res.status(400).json({ message: "endDate tidak valid"})}

        end.setHours(23, 59, 59, 999);

        where.transaction.createdAt.lte = end;
      }
    }

    const items = await prisma.transactionItem.findMany({
        where,
        select: {
          quantity: true, price: true, subtotal: true,
          product: { select: { id: true, name: true }},
          transaction: {select: { createdAt: true}}
        },

        orderBy: {transaction: {createdAt: "asc"} }});

    const dailyMap = new Map<string, {productId: number; productName: string; quantitySold: number; totalSales: number} >();

    for (const item of items) {
        const date = item.transaction.createdAt.toISOString().split("T")[0];
        
        if (!date) { continue}
        const key = `${date}|${item.product.id}`

        if (!dailyMap.has(key)) {dailyMap.set(key, { productId: item.product.id, productName: item.product.name, quantitySold: 0, totalSales: 0});
      }

      const daily = dailyMap.get(key)!;

      daily.quantitySold += item.quantity;

      daily.totalSales += Number(item.subtotal);
    }

    const report = Array.from(dailyMap.entries()).map(([key, data]) => {
        const [date] = key.split("|")
        return {date,...data}
    });

    return res.status(200).json({message:"Daily product sales report berhasil diambil", data: report})
  } catch (error) {
    console.error(error);

    return res.status(500).json({message: "Terjadi error di internal server"})
  }
};

export const getDiscrepancyReport = async (req: Request,res: Response) => {
  try {
    const shifts = await prisma.shift.findMany({where: {status: "CLOSED",cashDifference: {not: 0}},
      include: { cashier: { select: { id: true, name: true, email: true }}},
      orderBy: { endedAt: "desc"}});

    return res.status(200).json({message: "Laporan transaksi tidak sesuai berhasil diambil",data: shifts});
  } catch (error) {
    console.error(error);
    return res.status(500).json({message: "Terjadi error di server internal" });
  }
};