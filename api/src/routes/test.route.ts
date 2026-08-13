import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import {Role} from "@prisma/client"

const router = Router();

router.get("/protected", authenticate, (_req, res) => {
    res.json({ message : "Anda sudah terautentifikasi!"})
})

router.get("/admin-only", authenticate, authorize(Role.ADMIN), (_req, res)=> {
    res.json({ message : "Halo Admin"})
})

router.get("/cashier-only", authenticate, authorize(Role.CASHIER), (_req, res)=>{
    res.json({ message : "Halo Kasir!"})
})

export default router;