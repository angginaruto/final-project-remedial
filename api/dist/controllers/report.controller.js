import {} from "express";
import { dailySalesReportSchema, dailyProductSalesReportSchema } from "../validations/report.validation.js";
import { getShiftReportService, getDailySalesReportService, getDailyProductSalesReportService, getDiscrepancyReportService, ReportValidationError, } from "../services/report.service.js";
// search dan harian untuk pemeriksaan pemasukan
export const getShiftReport = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "akun belum terotorisasi" });
        }
        const { date } = req.query;
        const report = await getShiftReportService(req.user.id, typeof date === "string" ? date : undefined);
        return res.status(200).json({ message: "Shift report berhasil diambil", data: report });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Terjadi error di internal server" });
    }
};
export const getDailySalesReport = async (req, res) => {
    try {
        const validation = dailySalesReportSchema.safeParse(req.query);
        if (!validation.success) {
            return res.status(400).json({ message: "Query parameter tidak valid", errors: validation.error.flatten() });
        }
        if (!req.user) {
            return res.status(400).json({ message: "akun belum terotorisasi" });
        }
        const { startDate, endDate } = validation.data;
        const report = await getDailySalesReportService(req.user.id, startDate, endDate);
        return res.status(200).json({ message: "Daily sales report berhasil diambil", data: report });
    }
    catch (error) {
        if (error instanceof ReportValidationError) {
            return res.status(400).json({ message: error.message });
        }
        console.error(error);
        return res.status(500).json({ message: "Terjadi error di internal server" });
    }
};
export const getDailyProductSalesReport = async (req, res) => {
    try {
        const validation = dailyProductSalesReportSchema.safeParse(req.query);
        if (!validation.success) {
            return res.status(400).json({ message: "Query parameter tidak valid", errors: validation.error.flatten() });
        }
        if (!req.user) {
            return res.status(400).json({ message: "akun belum terotorisasi" });
        }
        const { startDate, endDate } = validation.data;
        const report = await getDailyProductSalesReportService(req.user.id, startDate, endDate);
        return res.status(200).json({ message: "Daily product sales report berhasil diambil", data: report });
    }
    catch (error) {
        if (error instanceof ReportValidationError) {
            return res.status(400).json({ message: error.message });
        }
        console.error(error);
        return res.status(500).json({ message: "Terjadi error di internal server" });
    }
};
export const getDiscrepancyReport = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(400).json({ message: "akun belum terotorisasi" });
        }
        const shifts = await getDiscrepancyReportService(req.user.id);
        return res.status(200).json({ message: "Laporan transaksi tidak sesuai berhasil diambil", data: shifts });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Terjadi error di server internal" });
    }
};
//# sourceMappingURL=report.controller.js.map