import { Router } from "express";
import {getCashier, getCashierById, createCashier, updateCashier, deleteCashier} from "../controllers/cashier.controller.js"
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import {Role} from "@prisma/client"

const router = Router()

router.get("/", authenticate, authorize(Role.ADMIN), getCashier)
router.get("/:id", authenticate, authorize(Role.ADMIN), getCashierById)
router.post("/", authenticate, authorize(Role.ADMIN), createCashier)
router.patch("/:id", authenticate, authorize(Role.ADMIN), updateCashier)
router.delete("/:id", authenticate, authorize(Role.ADMIN), deleteCashier)

export default router