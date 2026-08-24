import { previewTransaction, createCashTransaction, createDebitTransaction, getTransactionHistory, getTransactionById } from "../controllers/transaction.controller.js";
import { Router } from "express";
import { Role } from "@prisma/client";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
const router = Router();
router.post("/preview", authenticate, authorize(Role.CASHIER), previewTransaction);
router.post("/cash", authenticate, authorize(Role.CASHIER), createCashTransaction);
router.post("/debit", authenticate, authorize(Role.CASHIER), createDebitTransaction);
router.get("/", authenticate, authorize(Role.CASHIER), getTransactionHistory);
router.get("/:id", authenticate, authorize(Role.CASHIER), getTransactionById);
export default router;
//# sourceMappingURL=tansaction.route.js.map