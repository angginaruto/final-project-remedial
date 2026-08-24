export declare const getCashierService: (userId: number, filters: {
    search?: string | undefined;
    page: number;
    limit: number;
}) => Promise<{
    cashier: {
        email: string;
        id: number;
        name: string;
        role: import("@prisma/client").$Enums.Role;
        createdAt: Date;
    }[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}>;
export declare const getCashierByIdService: (userId: number, id: number) => Promise<{
    email: string;
    id: number;
    name: string;
    role: import("@prisma/client").$Enums.Role;
}>;
export declare const createCashierService: (userId: number, data: {
    name: string;
    email: string;
    password: string;
}) => Promise<{
    restored: boolean;
    cashier: {
        email: string;
        id: number;
        name: string;
        role: import("@prisma/client").$Enums.Role;
    };
}>;
export declare const updateCashierService: (userId: number, id: number, data: {
    name?: string | undefined;
    email?: string | undefined;
    password?: string | undefined;
}) => Promise<{
    email: string;
    id: number;
    name: string;
    role: import("@prisma/client").$Enums.Role;
    createdAt: Date;
    updatedAt: Date;
}>;
export declare const deleteCashierService: (userId: number, id: number) => Promise<void>;
export declare class CashierNotFoundError extends Error {
    constructor(message: string);
}
export declare class CashierConflictError extends Error {
    constructor(message: string);
}
//# sourceMappingURL=cashier.service.d.ts.map