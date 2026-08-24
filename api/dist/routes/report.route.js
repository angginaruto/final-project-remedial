import { Router } from "express";
import { Role } from "@prisma/client";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import { getShiftReport, getDailySalesReport, getDailyProductSalesReport, getDiscrepancyReport } from "../controllers/report.controller.js";
const router = Router();
router.get("/shifts", authenticate, authorize(Role.ADMIN), getShiftReport);
router.get("/daily", authenticate, authorize(Role.ADMIN), getDailySalesReport);
router.get("/products", authenticate, authorize(Role.ADMIN), getDailyProductSalesReport);
router.get("/discrepancy", authenticate, authorize(Role.ADMIN), getDiscrepancyReport);
export default router;
//# sourceMappingURL=report.route.js.map