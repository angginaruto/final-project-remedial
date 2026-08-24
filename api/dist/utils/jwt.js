import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error("JWT tidak terdefinisi");
}
export const generateToken = (payload) => {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: "1d"
    });
};
//# sourceMappingURL=jwt.js.map