import { type Request, type Response } from "express"
import prisma from "../utils/prisma.js"
import { comparePassword } from "../utils/password.js"
import {generateToken} from "../utils/jwt.js"
import { userSchema } from "../validations/user.validation.js"

export const login = async (req: Request, res : Response) => {
    try {
        const validation = userSchema.safeParse(req.body)
        if(!validation.success){return res.status(400).json({message : "gagal validasi", errors : validation.error.flatten()})}

        const {email, password} = validation.data;

        const user = await prisma.user.findUnique({
            where: { email,}})

        if (!user || user.isDeleted) {return res.status(401).json({ message : "Akun tidak ada atau sudah terhapus~"})}

        const isPasswordValid = await comparePassword( password, user.password)

        if(!isPasswordValid){return res.status(401).json({ message : "Username atau password salah"})}
        
        const token = generateToken({ id: user.id, role: user.role})

        return res.status(200).json({message : "Berhasil login", data : { user: { id : user.id, name : user.name, email: user.email, role : user.role }, token,} })
    }catch(error){
        console.error(error)

        return res.status(500).json({
            message : "Internal server sedang error"
        })
    }
}