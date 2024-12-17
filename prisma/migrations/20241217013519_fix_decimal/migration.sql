/*
  Warnings:

  - You are about to alter the column `price` on the `properties` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(12,2)`.

*/
-- AlterTable
ALTER TABLE `properties` MODIFY `price` DECIMAL(12, 2) NOT NULL DEFAULT 0.00;
