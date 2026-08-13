import {type Request, type Response} from "express"
import prisma from "../utils/prisma.js"
import { createCategorySchema, updateCategorySchema, getCategoriesSchema, deleteConfirmationSchema } from "../validations/category.validation.js"

export const getCategories= async (req : Request, res : Response) => {
    try {
        const validation = getCategoriesSchema.safeParse(req.query)

        if(!validation.success){ return res.status(400).json({ message : "query parameternya tidak valid", errors : validation.error.flatten()})}

        const {search , page, limit} = validation.data

        const skip = (page - 1) * limit

        const where = { isDeleted : false, ...(search?{name : {contains : search, mode : "insensitive" as const}}: {})}

        const [categories, total] =  await Promise.all([
            prisma.category.findMany({
                where, orderBy: {createdAt : "desc"},skip,take:limit
            }),
            prisma.category.count({
                where,
            })
        ])

        return res.status(200).json({ message : "kategori berhasil diambil", data : categories, pagination : {page, limit, total, totalPages : Math.ceil(total/limit)}})
    }catch(error){
        console.error(error)

        return res.status(500).json({ message : "ada error di server internal"})
    }
}

export const getCategoriesById = async (req : Request, res : Response) => {
    try{
        const id = Number(req.params.id)
        if(!Number.isInteger(id) || id <= 0){ return res.status(400).json({ message : "kategori id tidak valid"})}

        const category = await prisma.category.findFirst({ where : {id, isDeleted : false}, include : {products : {where : {isDeleted : false}}}})
        if(!category){ return res.status(404).json({ message : "kategori tidak ditemukan"})}

        return res.status(200).json({ message : "kategori berhasil diambil", data : category})
    }catch(error){
        console.error(error)

        return res.status(500).json({ message : "terjadi error di internal server"})
    }
}

export const createCategory = async (req : Request, res : Response) => {
    try{
    const validation = createCategorySchema.safeParse(req.body)

    if(!validation.success){
        return res.status(400).json({ message : "validasi error", errors : validation.error.flatten()})
    }

    const {name} = validation.data

    const existingCategory = await prisma.category.findFirst({
        where : {name : {equals : name, mode : "insensitive" }} })

    if(existingCategory) { if(!existingCategory.isDeleted){ return res.status(409).json({ message : "kategori sudah ada"})}

        const restoreCategory = await prisma.category.update({ where : {id : existingCategory.id}, data : {isDeleted : false}})

        return res.status(200).json({ message : "kategori berhasil dipulihkan", data : restoreCategory})
    }
    const category = await prisma.category.create({ data : {name}})
    
    return res.status(200).json({ message : "kategori berhasil dibuat", data : category})
    }catch(error){
        console.error(error)

        return res.status(500).json({message : "terjadi error di internal server"})
    }
}

export const updateCategory = async (req : Request, res : Response) => {
    try {
        const id = Number(req.params.id)

        if(!Number.isInteger(id) || id <= 0){ return res.status(400).json({ message : "kategori id tidak valid"})}

        const validation = updateCategorySchema.safeParse(req.body)

        if(!validation.success){ return res.status(400).json({ message : "validasi error", errors : validation.error.flatten()})}

        const { name } = validation.data

        const existingCategory = await prisma.category.findFirst({
            where : {id, isDeleted : false}
        })

        if(!existingCategory){ return res.status(404).json({message : "kategori tidak ditemukan"})}

        const duplicatedCategory = await prisma.category.findFirst({
            where : {name : { equals : name, mode : "insensitive"}, isDeleted : false, NOT : {id}}
        })

        if(duplicatedCategory){ return res.status(409).json("kategori sudah ada")}

        const category = await prisma.category.update({ where : {id}, data : {name}})

        return res.status(200).json({ message : "kategori berhasil diupdate", data : category})

    }catch(error){
        console.error(error)

        return res.status(500).json({ message : "terjadi error di internal server"})
    }
}

export const deleteCategory = async (req : Request, res : Response) => {
    try {
        const id = Number(req.params.id)

        if(!Number.isInteger(id) || id<=0){ return res.status(400).json({ message : "kategori id tidak valid"})}

        const category = await prisma.category.findFirst({ where : {id, isDeleted : false}})

        if(!category){ return res.status(404).json({ message : "kategori tidak ditemukan"})}

        const activeProducts = await prisma.product.count({ where: {categoryId : id, isDeleted : false}})

        if(activeProducts > 0){ return res.status(400).json({ message : "tidak bisa menghapus kategori yang masih memiliki produk"})}

        const validation = deleteConfirmationSchema.safeParse(req.body)

        if(!validation.success){return res.status(400).json({message : "perlu konfirmasi dulu sebelum menghapus", errors : validation.error.flatten()})}

        await prisma.category.update({ where : {id}, data : {isDeleted : true}})

        return res.status(200).json({ message : "kategori berhasil dihapus"})
    }catch(error){
        console.error(error)

        return res.status(500).json({ message : "terjadi error di internal server"})
    }
}