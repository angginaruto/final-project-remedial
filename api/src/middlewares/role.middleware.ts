import { type NextFunction, type Request, type Response } from "express";
import { Role } from "@prisma/client";

export const authorize = (...allowedRoles: Role[]) => {
  return ( req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Diperlukan autentifikasi", });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Anda tidak punya akses ke resource ini ya~", });
    }
    next();
  };
};