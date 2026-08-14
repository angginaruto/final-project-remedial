import { Router } from "express"
import { Role } from "@prisma/client"
import { getCategories, getCategoriesById, createCategory, updateCategory, deleteCategory} from "../controllers/category.controller.js"
import { authenticate } from "../middlewares/auth.middleware.js"
import { authorize } from "../middlewares/role.middleware.js"

const router = Router()

router.get("/", authenticate, authorize(Role.CASHIER, Role.ADMIN), getCategories)
router.get("/:id", authenticate, authorize(Role.ADMIN, Role.CASHIER), getCategoriesById)
router.post("/", authenticate, authorize(Role.ADMIN) ,createCategory)
router.patch("/:id", authenticate, authorize(Role.ADMIN), updateCategory)
router.delete("/:id", authenticate, authorize(Role.ADMIN), deleteCategory)

export default router;