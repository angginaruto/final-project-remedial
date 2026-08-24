import {} from "express";
import { createProductSchema, getProductsSchema, updateProductSchema, deleteConfirmationSchema } from "../validations/product.validation.js";
import { getOwnerAdminId } from "../utils/ownersship.js";
import { createProductService, getProductsService, getProductByIdService, updateProductService, deleteProductService, ProductNotFoundError, ProductConflictError, } from "../services/product.service.js";
export const createProduct = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(400).json({ message: "akun belum terotorisasi" });
        }
        const validation = createProductSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({ message: "error di validasi data product", errors: validation.error.flatten() });
        }
        const result = await createProductService(req.user.id, validation.data, req.file?.buffer);
        if (result.restored) {
            return res.status(200).json({ message: "produk berhasil dipulihkan", data: result.product });
        }
        return res.status(201).json({ message: "Produk berhasil dibuat!", data: result.product });
    }
    catch (error) {
        if (error instanceof ProductNotFoundError) {
            return res.status(404).json({ message: error.message });
        }
        if (error instanceof ProductConflictError) {
            return res.status(409).json({ message: error.message });
        }
        console.error(error);
        return res.status(500).json({ message: "server internal sedang ada masalah" });
    }
};
export const getProducts = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "user tidak terotorisasi" });
        }
        const ownerAdminId = await getOwnerAdminId(req.user);
        if (!ownerAdminId) {
            return res.status(403).json({ message: "akun tidak terhubung ke admin manapun" });
        }
        const validation = getProductsSchema.safeParse(req.query);
        if (!validation.success) {
            return res.status(400).json({ message: "query parameternya tidak valid", errors: validation.error.flatten() });
        }
        const { products, pagination } = await getProductsService(ownerAdminId, validation.data);
        return res.status(200).json({ message: "Produk berhasil diambil", data: products, pagination });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
export const getProductsById = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "user tidak terotorisasi" });
        }
        const ownerAdminId = await getOwnerAdminId(req.user);
        if (!ownerAdminId) {
            return res.status(403).json({ message: "akun tidak terhubung ke admin manapun" });
        }
        const id = Number(req.params.id);
        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({ message: "id tidak valid" });
        }
        const product = await getProductByIdService(ownerAdminId, id);
        return res.status(200).json({ message: "produk berhasil diambil", data: product });
    }
    catch (error) {
        if (error instanceof ProductNotFoundError) {
            return res.status(404).json({ message: error.message });
        }
        console.error(error);
        return res.status(500).json({ message: "server internal sedang error" });
    }
};
export const updateProduct = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "user tidak terotorisasi" });
        }
        const id = Number(req.params.id);
        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({ message: "id tidak valid" });
        }
        const validation = updateProductSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({ message: "validasi error", errors: validation.error.flatten() });
        }
        const updatedProduct = await updateProductService(req.user.id, id, validation.data, req.file?.buffer);
        return res.status(200).json({ message: "produk berhasil diupdate", data: updatedProduct });
    }
    catch (error) {
        if (error instanceof ProductNotFoundError) {
            return res.status(404).json({ message: error.message });
        }
        console.error(error);
        return res.status(500).json({ message: "server internal sedang error" });
    }
};
export const deleteProduct = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "user tidak terotorisasi" });
        }
        const id = Number(req.params.id);
        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({ message: "id-nya tidak valid" });
        }
        const validation = deleteConfirmationSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({ message: "perlu konfirmasi sebelum delere", errors: validation.error.flatten() });
        }
        await deleteProductService(req.user.id, id);
        return res.status(200).json({ message: "produk berhasil dihapus" });
    }
    catch (error) {
        if (error instanceof ProductNotFoundError) {
            return res.status(404).json({ message: error.message });
        }
        console.error(error);
        return res.status(500).json({ message: "terjadi error di server internal" });
    }
};
//# sourceMappingURL=product.controller.js.map