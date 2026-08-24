import {} from "express";
import { Role } from "@prisma/client";
export const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: "Diperlukan autentifikasi", });
        }
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: "Anda tidak punya akses ke resource ini ya~", });
        }
        next();
    };
};
//# sourceMappingURL=role.middleware.js.map