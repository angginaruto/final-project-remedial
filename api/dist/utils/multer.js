import multer from "multer";
// simpen di memory dulu (bukan disk), karena mau langsung di-upload ke cloudinary
const storage = multer.memoryStorage();
export const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // max 5MB
    fileFilter: (req, file, cb) => {
        const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error("format file harus jpg, png, atau webp"));
        }
        cb(null, true);
    }
});
//# sourceMappingURL=multer.js.map