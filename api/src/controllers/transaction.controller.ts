
import { type Request, type Response } from "express";
import prisma from "../utils/prisma.js";
import { transactionPreviewSchema, createCashTransactionSchema, createDebitTransactionSchema, getTransactionHistorySchema } from "../validations/transaction.validation.js";

export const previewTransaction = async (req: Request, res: Response) => {
  try {
    const validation = transactionPreviewSchema.safeParse(req.body);

    if (!validation.success) {return res.status(400).json({message: "Validasi transaction gagal",errors: validation.error.flatten()})}

    const { items } = validation.data;

    const productIds = items.map((item) => item.productId)

    const products = await prisma.product.findMany({
      where: {id: {in: productIds} ,isDeleted: false},
      select: {id: true, name: true, price: true,stock: true}})

    if (products.length !== productIds.length) {return res.status(404).json({message: "Ada product yang tidak ditemukan"})}

    const transactionItems = [];

    for (const item of items) {const product = products.find((product) => product.id === item.productId)
      if (!product) {return res.status(404).json({message: `Product dengan id ${item.productId} tidak ditemukan`})}

      if (item.quantity > product.stock) {return res.status(400).json({message: `Stock ${product.name} tidak mencukupi`,
          availableStock: product.stock,requestedQuantity: item.quantity})}

      const price = Number(product.price);
      const subtotal = price * item.quantity;

      transactionItems.push({productId: product.id,name: product.name,price,quantity: item.quantity,subtotal});
    }

    const totalAmount = transactionItems.reduce((total, item) => total + item.subtotal,0);

    return res.status(200).json({message: "Preview transaction berhasil",data: { items: transactionItems, totalAmount }});
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Terjadi error di internal server"})
  }
};

export const createCashTransaction = async (req:Request, res:Response) => {
    try{
      const validation = createCashTransactionSchema.safeParse(req.body)
      
      if(!validation.success){return res.status(400).json({message : "terjadi error saat validasi", errors : validation.error.flatten()})}
      const {items, cashReceived} = validation.data
      const cashierId = req.user!.id
      const shift = await prisma.shift.findFirst({where : {cashierId, status:"OPEN"}})
      
      if(!shift){return res.status(404).json({message : "cashier belum memiliki shift yang aktif"})}
      const productIds = items.map((item)=>item.productId)
      const products = await prisma.product.findMany({where : {id : { in : productIds}, isDeleted : false}, select : {id : true, name : true, price : true, stock : true}})
      
      if(products.length !== productIds.length){return res.status(404).json({message : "ada produk yang tidak lengkap"})}
      const transactionItems : {productId : number
        quantity : number
        price : number
        subTotal : number
      }[] = []
      
      for(const item of items){
        const product = products.find((product)=>product.id === item.productId)
        if(!product){return res.status(404).json({message : `produk ${item.productId} tidak ditemukan`})}

        if(item.quantity > product.stock){return res.status(400).json({messsage : `stock ${product.name} tidak mencukupi`, availableStock : product.stock, requestedQuantity : item.quantity})}

        const price = Number(product.price)

        const subTotal = price * item.quantity

        transactionItems.push({productId : product.id, quantity : item.quantity, price, subTotal})

        const totalAmount = transactionItems.reduce((total, item)=>total + item.subTotal,0)

        if(cashReceived < totalAmount){return res.status(400).json({message : "uang tidak mencukupi", totalAmount, cashReceived, shortage : totalAmount - cashReceived})}

        const changeAmount = cashReceived - totalAmount

        const transaction = await prisma.$transaction(async (tx) => {
            const createdTransaction = await tx.transaction.create({data : {shiftId : shift.id, cashierId, totalAmount, paymentMethod:"CASH", cashReceived, changeAmount}})

            await tx.transactionItem.createMany({
                data : transactionItems.map((item)=>({
                    transactionId : createdTransaction.id,
                    productId : item.productId,
                    quantity : item.quantity,
                    price : item.price,
                    subtotal : item.subTotal
                }))
            })

            for (const item of transactionItems) {
                await tx.product.update({
                    where: {id: item.productId}, data: {stock: {decrement: item.quantity}}})
        }

        return createdTransaction;
      });
       return res.status(201).json({message: "Transaksi cash berhasil",data: {transaction,items: transactionItems,totalAmount,cashReceived,changeAmount}});
      }
    }catch(error){
        console.error(error)
        return res.status(500).json({message : "terjadi error di internal server"})
    }
}

export const createDebitTransaction = async (req: Request,res: Response) => {
  try {
    const validation = createDebitTransactionSchema.safeParse(req.body);

    if (!validation.success) {return res.status(400).json({ message: "Validasi transaction gagal", errors: validation.error.flatten()});}

    const { items, cardNumber } = validation.data;
    
    if(!req.user){return res.status(404).json({message : "pengguna tidak ditemukan"})}
    const cashierId = req.user.id;

    const shift = await prisma.shift.findFirst({where: {cashierId,status: "OPEN"}});

    if (!shift) {return res.status(400).json({message: "Cashier belum memiliki shift yang aktif"})}

    const productIds = items.map((item) => item.productId);

    const products = await prisma.product.findMany({where: {id: {in: productIds},isDeleted: false},
      select: {id: true, name: true, price: true, stock: true}});

    if (products.length !== productIds.length) { return res.status(404).json({message: "Ada product yang tidak ditemukan",})}

    const transactionItems : {productId : number; quantity : number; price : number; subtotal : number}[] = [];

    for (const item of items) {const product = products.find((product) =>product.id === item.productId);

      if (!product) {return res.status(404).json({message:`Product ${item.productId} tidak ditemukan`})}

      if (item.quantity > product.stock) {return res.status(400).json({message:`Stock ${product.name} tidak mencukupi`,availableStock: product.stock,requestedQuantity: item.quantity}); }

      const price = Number(product.price);

      const subtotal = price * item.quantity;

      transactionItems.push({productId: product.id, quantity: item.quantity, price, subtotal});
    }

    const totalAmount =transactionItems.reduce((total, item) => total + item.subtotal,0);

    const cardLastFour = cardNumber.slice(-4);

    const transaction =
      await prisma.$transaction(async (tx) => {

        const createdTransaction =await tx.transaction.create({
            data: {shiftId: shift.id,cashierId,totalAmount,paymentMethod: "DEBIT",cardLastFour },});

        await tx.transactionItem.createMany({
          data: transactionItems.map((item) => ({ transactionId:createdTransaction.id,productId: item.productId,quantity: item.quantity,price: item.price,subtotal: item.subtotal}))
        });

        for (const item of transactionItems) {
          await tx.product.update({where: {id: item.productId},
            data: {stock: {decrement: item.quantity}}});
        }

        return createdTransaction;
      });

    return res.status(201).json({message: "Transaksi debit berhasil",data: {transaction,items: transactionItems,totalAmount,cardLastFour }});

  } catch (error) {
    console.error(error);
    return res.status(500).json({message:"Terjadi error di internal server"});
  }
};

export const getTransactionHistory = async (req: Request,res: Response) => {
  try {
    const validation =getTransactionHistorySchema.safeParse(req.query);

    if (!validation.success) {return res.status(400).json({ message: "Query parameter tidak valid", errors: validation.error.flatten(),});}

    const { page, limit } = validation.data;
    const cashierId = req.user!.id;
    const skip = (page - 1) * limit;

    // const startOfDay = new Date(); startOfDay.setHours(0, 0, 0, 0);

    // const endOfDay = new Date(startOfDay); endOfDay.setDate(endOfDay.getDate() + 1);

    const where = { cashierId} //createdAt: { gte: startOfDay, lt: endOfDay }};

    const [transactions, total] = await Promise.all([ prisma.transaction.findMany({ where, include: { items: { include: {product: { select: { id: true,name: true}} }} },
        orderBy: {
            createdAt: "desc" },
            skip, take: limit }), prisma.transaction.count({where})]);

    return res.status(200).json({message: "History transaksi berhasil diambil",data: transactions,pagination: {page,limit,total,totalPages: Math.ceil(total / limit)}});

  } catch (error) {
    console.error(error);
    return res.status(500).json({message: "Terjadi error di internal server"});
  }
};

export const getTransactionById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {return res.status(400).json({message: "id transaksi tidak valid" }) }

    const cashierId = req.user!.id;

    const transaction = await prisma.transaction.findFirst({where: {id,cashierId,},include: {items: {include: {
              product: {select: {id: true,name: true}}}},
          shift: {select: {id: true,startedAt: true,endedAt: true}}}})

    if (!transaction) {return res.status(404).json({message: "Transaksi tidak ditemukan"})}

    return res.status(200).json({message: "Detail transaksi berhasil diambil",data: transaction});

  } catch (error) {
    console.error(error);
    return res.status(500).json({message: "Terjadi error di internal server"});
  }
};