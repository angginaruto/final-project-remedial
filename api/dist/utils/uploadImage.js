import cloudinary from "./cloudinary.js";
export const uploadToCloudinary = (fileBuffer, folder) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream({ folder }, (error, result) => {
            if (error || !result) {
                return reject(error);
            }
            resolve(result.secure_url);
        });
        uploadStream.end(fileBuffer);
    });
};
//# sourceMappingURL=uploadImage.js.map