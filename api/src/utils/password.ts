import bcript from "bcrypt";

export const hashPassword = async (password: string) => {
    return bcript.hash(password, 10);
}

export const comparePassword = async (password : string, hashedPassword: string) => {
    return bcript.compare(password,hashedPassword)
}