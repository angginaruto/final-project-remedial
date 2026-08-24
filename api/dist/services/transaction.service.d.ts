export declare const previewTransactionService: (items: {
    productId: number;
    quantity: number;
}[]) => Promise<{
    items: {
        productId: number;
        name: string;
        price: number;
        quantity: number;
        subtotal: number;
    }[];
    totalAmount: number;
}>;
export declare const createCashTransactionService: (cashierId: number, items: {
    productId: number;
    quantity: number;
}[], cashReceived: number) => Promise<{
    id: number;
    createdAt: Date;
    cashierId: number;
    shiftId: number;
    totalAmount: import("@prisma/client-runtime-utils").Decimal;
    paymentMethod: import("@prisma/client").$Enums.PaymentMethod;
    cashReceived: import("@prisma/client-runtime-utils").Decimal | null;
    changeAmount: import("@prisma/client-runtime-utils").Decimal | null;
    cardLastFour: string | null;
}>;
export declare const createDebitTransactionService: (cashierId: number, items: {
    productId: number;
    quantity: number;
}[], cardNumber: string) => Promise<{
    transaction: {
        id: number;
        createdAt: Date;
        cashierId: number;
        shiftId: number;
        totalAmount: import("@prisma/client-runtime-utils").Decimal;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod;
        cashReceived: import("@prisma/client-runtime-utils").Decimal | null;
        changeAmount: import("@prisma/client-runtime-utils").Decimal | null;
        cardLastFour: string | null;
    };
    items: {
        productId: number;
        quantity: number;
        price: number;
        subtotal: number;
    }[];
    totalAmount: number;
    cardLastFour: string;
}>;
export declare const getTransactionHistoryService: (cashierId: number, filters: {
    page: number;
    limit: number;
}) => Promise<{
    transactions: ({
        items: ({
            product: {
                id: number;
                name: string;
            };
        } & {
            id: number;
            price: import("@prisma/client-runtime-utils").Decimal;
            productId: number;
            quantity: number;
            transactionId: number;
            subtotal: import("@prisma/client-runtime-utils").Decimal;
        })[];
    } & {
        id: number;
        createdAt: Date;
        cashierId: number;
        shiftId: number;
        totalAmount: import("@prisma/client-runtime-utils").Decimal;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod;
        cashReceived: import("@prisma/client-runtime-utils").Decimal | null;
        changeAmount: import("@prisma/client-runtime-utils").Decimal | null;
        cardLastFour: string | null;
    })[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}>;
export declare const getTransactionByIdService: (cashierId: number, id: number) => Promise<{
    items: ({
        product: {
            id: number;
            name: string;
        };
    } & {
        id: number;
        price: import("@prisma/client-runtime-utils").Decimal;
        productId: number;
        quantity: number;
        transactionId: number;
        subtotal: import("@prisma/client-runtime-utils").Decimal;
    })[];
    shift: {
        id: number;
        startedAt: Date;
        endedAt: Date | null;
    };
} & {
    id: number;
    createdAt: Date;
    cashierId: number;
    shiftId: number;
    totalAmount: import("@prisma/client-runtime-utils").Decimal;
    paymentMethod: import("@prisma/client").$Enums.PaymentMethod;
    cashReceived: import("@prisma/client-runtime-utils").Decimal | null;
    changeAmount: import("@prisma/client-runtime-utils").Decimal | null;
    cardLastFour: string | null;
}>;
export declare class ProductNotFoundError extends Error {
    constructor(message: string);
}
export declare class StockInsufficientError extends Error {
    availableStock: number;
    requestedQuantity: number;
    constructor(message: string, availableStock: number, requestedQuantity: number);
}
export declare class ShiftNotFoundError extends Error {
    constructor(message: string);
}
export declare class CashInsufficientError extends Error {
    totalAmount: number;
    cashReceived: number;
    constructor(message: string, totalAmount: number, cashReceived: number);
}
export declare class TransactionNotFoundError extends Error {
    constructor(message: string);
}
//# sourceMappingURL=transaction.service.d.ts.map