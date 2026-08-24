import bcript from "bcrypt";
export const hashPassword = async (password) => {
    return bcript.hash(password, 10);
};
export const comparePassword = async (password, hashedPassword) => {
    return bcript.compare(password, hashedPassword);
};
//# sourceMappingURL=password.js.map