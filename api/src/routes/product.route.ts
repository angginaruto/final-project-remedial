import {Router} from "express";
import {Role} from "@prisma/client"
import { createProduct } from "../controllers/product.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import { getProducts, getProductsById, updateProduct, deleteProduct } from "../controllers/product.controller.js";
import { upload } from "../utils/multer.js"

const router = Router()

router.post("/", authenticate, authorize(Role.ADMIN),  upload.single("image"), createProduct)
router.get("/", authenticate, authorize(Role.ADMIN, Role.CASHIER), getProducts)
router.get("/:id", authenticate, authorize(Role.ADMIN, Role.CASHIER), getProductsById)
router.patch("/:id", authenticate, authorize(Role.ADMIN),  upload.single("image"), updateProduct)
router.delete("/:id", authenticate, authorize(Role.ADMIN), deleteProduct)

export default router;