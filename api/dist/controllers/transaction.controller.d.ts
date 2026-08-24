import { type Request, type Response } from "express";
export declare const previewTransaction: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const createCashTransaction: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const createDebitTransaction: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getTransactionHistory: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getTransactionById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=transaction.controller.d.ts.map