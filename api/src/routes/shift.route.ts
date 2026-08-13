import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import { startShift, getCurrentShift, endShift } from "../controllers/shift.controller.js";

const router = Router()

router.post("/start", authenticate, authorize("CASHIER"), startShift)
router.get("/current", authenticate, authorize("CASHIER"), getCurrentShift)
router.post("/end", authenticate,authorize("CASHIER"),endShift)


export default router