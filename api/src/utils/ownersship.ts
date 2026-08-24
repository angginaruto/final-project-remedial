import { Role } from "@prisma/client";
import prisma from "./prisma.js";

// helper: dapetin id admin pemilik, baik dia login sebagai admin ATAU cashier
export const getOwnerAdminId = async (user: { id: number; role: Role }) => {
    if (user.role === Role.ADMIN) return user.id
    const cashier = await prisma.user.findUnique({ where: { id: user.id }, select: { createdById: true } })
    return cashier?.createdById ?? null
}