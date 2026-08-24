/*
  Warnings:

  - Added the required column `createdById` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable: tambah kolom sebagai nullable dulu
ALTER TABLE "Product" ADD COLUMN     "createdById" INTEGER;

-- Isi data lama pakai id admin (GANTI angka 1 sesuai id admin kamu)
UPDATE "Product" SET "createdById" = 1 WHERE "createdById" IS NULL;

-- Baru diubah jadi NOT NULL setelah semua row keisi
ALTER TABLE "Product" ALTER COLUMN "createdById" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "createdById" INTEGER;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;