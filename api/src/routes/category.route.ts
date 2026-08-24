import {Router} from "express";
import {Role} from "@prisma/client"
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import { getCategories, createCategory, getCategoriesById, updateCategory, deleteCategory } from "../controllers/category.controller.js";
import { upload } from "../utils/multer.js"

const router = Router()

router.post("/", authenticate, authorize(Role.ADMIN),  upload.single("image"), createCategory)
router.get("/", authenticate, authorize(Role.ADMIN, Role.CASHIER), getCategories)
router.get("/:id", authenticate, authorize(Role.ADMIN, Role.CASHIER), getCategoriesById)
router.patch("/:id", authenticate, authorize(Role.ADMIN),  upload.single("image"), updateCategory)
router.delete("/:id", authenticate, authorize(Role.ADMIN), deleteCategory)

export default router;