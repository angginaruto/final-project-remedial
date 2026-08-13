import { Router } from "express"
import { Role } from "@prisma/client"
import { getCategories, getCategoriesById, createCategory, updateCategory, deleteCategory} from "../controllers/category.controller.js"
import { authenticate } from "../middlewares/auth.middleware.js"
import { authorize } from "../middlewares/role.middleware.js"

const router = Router()

router.use( authenticate, authorize(Role.ADMIN))

router.get("/", getCategories)
router.get("/:id", getCategoriesById)
router.post("/", createCategory)
router.patch("/:id", updateCategory)
router.delete("/:id", deleteCategory)

export default router;