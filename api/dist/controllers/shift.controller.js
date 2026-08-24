import {} from "express";
import prisma from "../utils/prisma.js";
import { startShiftSchema, endShiftSchema } from "../validations/shift.validation.js";
export const startShift = async (req, res) => {
    try {
        const validation = startShiftSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({ message: "error di validasi", errors: validation.error.flatten() });
        }
        const { initialCash } = validation.data;
        if (!req.user) {
            return res.status(401).json({ message: "user tidak terotorisasi" });
        }
        const cashierId = req.user.id;
        const shift = await prisma.$transaction(async (tx) => {
            const existingShift = await tx.shift.findFirst({
                where: { cashierId, status: "OPEN" }
            });
            if (existingShift) {
                throw new Error("SHIFT_ALREADY_OPEN");
            }
            return tx.shift.create({ data: { cashierId, initialCash, status: "OPEN" } });
        });
        return res.status(200).json({ message: "Shift berhasil dimulai", data: shift });
    }
    catch (error) {
        console.error(error);
        if (error instanceof Error && error.message === "SHIFT_ALREADY_OPEN") {
            return res.status(409).json({ message: "anda masih punya shift yang sedang berjalan" });
        }
        return res.status(500).json({ message: "terjadi error di server internal" });
    }
};
export const getCurrentShift = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "user tidak terotorisasi" });
        }
        const cashierId = req.user.id;
        const shift = await prisma.shift.findFirst({
            where: { cashierId, status: "OPEN" }, include: { cashier: { select: { id: true, name: true, email: true } } }
        });
        if (!shift) {
            return res.status(404).json({ message: "tidak ada shift yang aktif" });
        }
        return res.status(200).json({ message: "data shift berhasil diambil", data: shift });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "terjadi error di internal server" });
    }
};
export const endShift = async (req, res) => {
    try {
        const validation = endShiftSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({ message: "error di validasi", errors: validation.error.flatten() });
        }
        const { finalCash } = validation.data;
        if (!req.user) {
            return res.status(401).json({ message: "user tidak terotorisasi" });
        }
        const cashierId = req.user.id;
        const shift = await prisma.shift.findFirst({ where: { cashierId, status: "OPEN" } });
        if (!shift) {
            return res.status(500).json({ message: "tidak ada shift yang aktif" });
        }
        const transaction = await prisma.transaction.findMany({
            where: { shiftId: shift.id, paymentMethod: "CASH" }, select: { totalAmount: true }
        });
        const totalCashTransaction = transaction.reduce((total, transaction) => { return total + Number(transaction.totalAmount); }, 0);
        const expectedCash = Number(shift.initialCash) + totalCashTransaction;
        const cashDifference = finalCash - expectedCash;
        const closedShift = await prisma.shift.update({ where: { id: shift.id }, data: { endedAt: new Date(), finalCash, expectedCash, cashDifference, status: "CLOSED" },
            select: { id: true, cashierId: true, startedAt: true, endedAt: true, initialCash: true, finalCash: true, expectedCash: true, cashDifference: true, status: true } });
        return res.status(200).json({ message: "berhasil mengakhiri shift", data: closedShift });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "terjadi error di inernal server" });
    }
};
//# sourceMappingURL=shift.controller.js.map