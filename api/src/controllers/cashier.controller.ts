import {type Request, type Response} from "express"
import bcrypt from "bcrypt"
import prisma from "../utils/prisma.js"
import { createCashierSchema, updateCashierSchema, getCashierSchema } from "../validations/cashier.validation.js"
import { deleteConfirmationSchema } from "../validations/product.validation.js"
import { Role } from "@prisma/client"

export const getCashier = async (req : Request, res : Response) => {
    try{
        const validation = getCashierSchema.safeParse(req.query)
        if(!validation.success){ return res.status(400).json({ message : "query-nya tidak valid", errors : validation.error.flatten()})}

        const { search, page, limit } = validation.data
        const skip = (page - 1)*limit

        const where = {role : Role.CASHIER, isDeleted : false, 
            ...(search?{OR : [{name : {contains : search, mode : "insensitive" as const}},
                {email : {contains : search, mode : "insensitive" as const}}],}:{})
        }
        const [cashier, total] = await Promise.all([
            prisma.user.findMany({
                where, select : {id : true, name : true, email : true, role : true, createdAt : true}, 
                skip, take: limit, orderBy : {createdAt : "desc"}}),
            prisma.user.count({where})
        ])

        return res.status(200).json({message : "data kasir berhasil diambil", data : cashier, pagination : {page, limit, total, totalPages : Math.ceil(total/limit)}})

    }catch(error){
        console.error(error)
        return res.status(500).json({messsage : "terjadi error di internal server"})
    }
}

export const getCashierById = async (req : Request, res : Response) => {
    try {
        const id = Number(req.params.id)
        if(!Number.isInteger(id) || id <= 0){ return res.status(400).json({message : "id kasirnya tidak valid"})}

        const cashier = await prisma.user.findFirst({ where : {id, role : Role.CASHIER, isDeleted : false}, 
        select : {id : true, name : true, email : true, role : true}})
        if(!cashier){ return res.status(404).json({message : "kasir tidak ditemukan"})}

        return res.status(200).json({message : "kasir berhasil diambil", data : cashier})
    }catch(error){
        console.error(error)
        return res.status(500).json({ message : "terjadi error di internal server"})
    }
}

export const createCashier = async (req : Request, res : Response) => {
    try {
        const validation = createCashierSchema.safeParse(req.body)
        if(!validation.success){ return res.status(400).json({message : "validasi error", errors : validation.error.flatten()})}

        const {name, email, password} = validation.data

        const existingUser = await prisma.user.findUnique({
            where : {email}
        })

        if (existingUser) { 
            if(!existingUser.isDeleted){return res.status(409).json({message : "email sudah digunakan"})}

            const hashedPassword = await bcrypt.hash(password, 10)

            const restoredCashier = await prisma.user.update({
                where : {id : existingUser.id}, data : {name, password:hashedPassword, role:Role.CASHIER, isDeleted:false}, select : {id:true,name:true,email:true,role:true,createdAt:true,updatedAt:true}
            })
            
            return res.status(200).json({ message : "user sudah berhasil dipulihkan", data : restoredCashier})}

        const hashedPassword = await bcrypt.hash(password, 10)

        const cashier = await prisma.user.create({
            data : {name, email, password : hashedPassword, role : Role.CASHIER},
            select : {id : true, name : true, email : true, role : true}
        })

        return res.status(200).json({message : "kasir baru berhasil dibuat", data : cashier})
    }catch(error){
        console.error(error)
        return res.status(500).json({ message : "terjadi error di internal server"})
    }
}

export const updateCashier = async (req : Request, res : Response) => {
    try {
        const id = Number(req.params.id)
        if(!Number.isInteger(id) || id <= 0){return res.status(400).json({message : "id tidak valid"})}

        const validation = updateCashierSchema.safeParse(req.body)
        if (!validation.success) {
            return res.status(400).json({message: "gagal validasi",errors: validation.error.flatten()})
        }
        const {name, email, password} = validation.data

        const existingUser = await prisma.user.findFirst({ where : {id, role : Role.CASHIER, isDeleted:false}})
        if(!existingUser){return res.status(404).json({message : "kasir tidak ditemukan"})}
            
        if(email){
            const duplicatedEmail = await prisma.user.findFirst({ where : {email, NOT : {id}}})
            if(duplicatedEmail){return res.status(409).json({message : "alamat email sudah digunakan"})}
        }

        const updateData : {name? : string; email? : string; password? : string} = {}

        if(name !== undefined){updateData.name = name}
        if(email !== undefined){updateData.email = email}
        if(password !== undefined){updateData.password = await bcrypt.hash(password, 10)}

        const cashier = await prisma.user.update({ where : {id}, data : updateData, select: {id : true, name : true, email : true, role:true, createdAt: true, updatedAt:true}})
        return res.status(200).json({message : "data kasir berhasil diupdate", data : cashier})
        
    }catch(error){
        console.error(error)
        return res.status(500).json({message : "error di server internal"})
    }
}

export const deleteCashier = async(req : Request, res : Response) => {
    try{
        const id = Number(req.params.id)
        if(!Number.isInteger(id) || id <= 0){return res.status(400).json({message : "id tidak valid"})}

        const cashier = await prisma.user.findFirst({where : {id, role:Role.CASHIER, isDeleted:false}})
        if(!cashier){return res.status(404).json({message : "kasir tidak ditemukan"})}

        const validation = deleteConfirmationSchema.safeParse(req.body)
        if(!validation.success){return res.status(400).json({message : "harus konfirmasi dulu sebelum delete", errors : validation.error.flatten()})}

        await prisma.user.update({where : {id}, data : {isDeleted:true}})
        return res.status(200).json({message : "kasir berhasil dihapus"})
    }catch(error){
        console.error(error)
        return res.status(500).json({message : "internal server error"})
    }
}