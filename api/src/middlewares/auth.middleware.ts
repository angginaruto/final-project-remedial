import { type NextFunction, type Request, type Response} from "express";
import jwt from "jsonwebtoken"
import {Role} from "@prisma/client"

const JWT_SECRET = process.env.JWT_SECRET

if(!JWT_SECRET) {
    throw new Error("JWT SECRET gak terdefinisi")
}

interface JwtPayLoad { id : number; role : Role;}

export const authenticate = ( req: Request, res: Response, next: NextFunction,) => {
  try {
    const authorization = req.headers.authorization;
    if (!authorization) {
      return res.status(401).json({ message: "Dibutuhkan otorisasi dulu~",});
    }

    const [type, token] = authorization.split(" ");

    if (type !== "Bearer" || !token) {
      return res.status(401).json({ message: "Format token otorisasinya tidak valid~",});
    }

    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayLoad;

    req.user = {id: decoded.id, role: decoded.role,};

    next();
  } catch (error) {
    return res.status(401).json({ message: "Token tidak valid atau sudah kadaluarsa", });
  }
};