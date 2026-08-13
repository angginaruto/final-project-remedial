import {type Request, type Response} from "express";
import prisma from "../utils/prisma.js"
import { createProductSchema } from "../validations/product.validation.js";
import { getProductsSchema } from "../validations/product.validation.js";
import { updateProductSchema, deleteConfirmationSchema } from "../validations/product.validation.js";

export const createProduct = async (req : Request, res : Response) => {
    try {
        const validation = createProductSchema.safeParse(req.body)

        if(!validation.success){return res.status(400).json({ message : "error di validasi data product", errors : validation.error.flatten()})}

        const {name, price, stock, categoryId} = validation.data

        const category = await prisma.category.findUnique({ where : { id : categoryId, }})

        if(!category || category.isDeleted){ return res.status(404).json({ message : "kategori tidak ditemukan"})}

        const existingProduct = await prisma.product.findFirst({ where : {name}})

        if(existingProduct){ 
            if(!existingProduct.isDeleted){return res.status(409).json({ message : "nama produk sudah ada"})}
            const restoreProduct = await prisma.product.update({where : {id : existingProduct.id}, data : {isDeleted : false}})
            return res.status(200).json({message : "produk berhasil dipulihkan", data : restoreProduct})
        }
        const product = await prisma.product.create({ data : {name, price, stock, categoryId} })

        return res.status(201).json({ message : "Produk berhasil dibuat!", data : product})
    } catch(error){
        console.error(error)
        return res.status(500).json({ message : "server internal sedang ada masalah"})
    }
}

export const getProducts = async (req : Request, res : Response) => {
    try {
        const validation = getProductsSchema.safeParse(req.query)

        if(!validation.success){ return res.status(400).json({ message : "query parameternya tidak valid", errors : validation.error.flatten()})}

       const { search, categoryId, page, limit} = validation.data;

    const skip = (page - 1) * limit;

    const where = { isDeleted: false, ...(search? { name: { contains: search, mode: "insensitive" as const, }, } : {}),
        ...(categoryId? { categoryId,} : {}),
    };

    const [products, total] = await Promise.all([ prisma.product.findMany({ where,
        include: { category: true,}, orderBy: { createdAt: "desc",}, skip, take: limit, }),
        prisma.product.count({ where,}),
    ]);

    return res.status(200).json({ message: "Produk berhasil diambil",data: products,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit), },});
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getProductsById = async (req : Request, res : Response) => {
    try {
        const id = Number(req.params.id)

        if(!Number.isInteger(id) || id <= 0) { return res.status(400).json({ message : "id tidak valid"})}

        const product = await prisma.product.findFirst({ 
            where : {id, isDeleted:false}, include: {category:true}
        })

        if(!product){
            return res.status(404).json({ message : "produk tidak ditemukan"})
        }

        return res.status(200).json({ message : "produk berhasil diambil", data : product})
    }catch(error){
        console.error(error)
        return res.status(500).json({ message : "server internal sedang error"})
    }
}

export const updateProduct = async (req : Request, res : Response) => {
    try {
        const id = Number(req.params.id)

        if(!Number.isInteger(id) || id <= 0) { return res.status(400).json({ message : "id tidak valid"})}

        const validation = updateProductSchema.safeParse(req.body)

        if(!validation.success) {return res.status(400).json( {message : "validasi error", errors : validation.error.flatten()})}

        const data = validation.data

        const existingProduct = await prisma.product.findFirst({ where : {id, isDeleted : false}})

        if(!existingProduct){ return res.status(404).json({ message : "produk tidakk ditemukan"})}

        if(data.categoryId !== undefined){
            const category = await prisma.category.findFirst({ where : {id : data.categoryId, isDeleted : false}})
            if (!category){ return res.status(404).json({ message : "kategori tidak ditemukan"})}
        }

        const updateProduct = await prisma.product.update({
            where : {id}, data : {
                ...(data.name !== undefined && {name : data.name}),
                ...(data.price !== undefined && {price : data.price}),
                ...(data.stock !== undefined && {stock : data.stock}),
                ...(data.categoryId !== undefined && {categoryId : data.categoryId})
            }, 
            include : { category : true}
        })

        return res.status(200).json({ message : "produk berhasil diupdate", data : updateProduct})
    }catch(error){
        console.error(error)

        return res.status(500).json({ message : "server internal sedang error"})
    }
}

export const deleteProduct = async (req : Request, res : Response) => {
    try{
        const id = Number(req.params.id)
        if(!Number.isInteger(id) || id <= 0){return res.status(400).json({message : "id-nya tidak valid"})}

        const product = await prisma.product.findFirst({where : {id, isDeleted:false}})
        if(!product){ return res.status(404).json({message : "produk tidak ditemukan"})}
        
        const validation = deleteConfirmationSchema.safeParse(req.body)
        if(!validation.success){return res.status(400).json({message : "perlu konfirmasi sebelum delere", errors : validation.error.flatten()})}

        await prisma.product.update({where : {id}, data : {isDeleted : true}})
        return res.status(200).json({message : "produk berhasil dihapus"})
    }catch(error){
        console.error(error)
        return res.status(500).json({message : "terjadi error di server internal"})
    }
}