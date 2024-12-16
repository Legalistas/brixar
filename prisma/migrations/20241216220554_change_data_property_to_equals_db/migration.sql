/*
  Warnings:

  - You are about to alter the column `state` on the `properties` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `propertyType` on the `properties` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(0))`.
  - You are about to alter the column `listingType` on the `properties` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(1))`.

*/
-- AlterTable
ALTER TABLE `countries` ADD COLUMN `propertyId` INTEGER NULL;

-- AlterTable
ALTER TABLE `properties` ADD COLUMN `country` INTEGER NULL,
    MODIFY `city` VARCHAR(191) NULL,
    MODIFY `state` INTEGER NULL,
    MODIFY `zipCode` VARCHAR(191) NULL,
    MODIFY `propertyType` ENUM('APARTMENT', 'HOUSE') NOT NULL,
    MODIFY `listingType` ENUM('SALE', 'RENT') NOT NULL;

-- AlterTable
ALTER TABLE `states` ADD COLUMN `propertyId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `countries` ADD CONSTRAINT `countries_propertyId_fkey` FOREIGN KEY (`propertyId`) REFERENCES `properties`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `states` ADD CONSTRAINT `states_propertyId_fkey` FOREIGN KEY (`propertyId`) REFERENCES `properties`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
