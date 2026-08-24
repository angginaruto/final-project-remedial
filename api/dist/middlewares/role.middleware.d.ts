import { type NextFunction, type Request, type Response } from "express";
import { Role } from "@prisma/client";
export declare const authorize: (...allowedRoles: Role[]) => (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=role.middleware.d.ts.map