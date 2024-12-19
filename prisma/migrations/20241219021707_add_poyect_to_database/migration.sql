/*
  Warnings:

  - You are about to drop the column `image` on the `proyects` table. All the data in the column will be lost.
  - Added the required column `businessModel` to the `proyects` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `proyects` DROP COLUMN `image`,
    ADD COLUMN `businessModel` ENUM('SOLD', 'RENT', 'LEADING') NOT NULL,
    ADD COLUMN `daysToEnd` INTEGER NULL,
    ADD COLUMN `daysToStart` INTEGER NULL,
    ADD COLUMN `details` JSON NULL,
    ADD COLUMN `fundedDate` DATETIME(3) NULL,
    ADD COLUMN `openingLine` TEXT NULL,
    ADD COLUMN `openingPhase` INTEGER NULL,
    ADD COLUMN `phase` ENUM('IN_STUDY', 'FUNDING', 'CONSTRUCTION', 'COMPLETED') NOT NULL DEFAULT 'FUNDING',
    ADD COLUMN `priority` INTEGER NULL,
    ADD COLUMN `promotorId` INTEGER NULL,
    ADD COLUMN `timeline` JSON NULL,
    MODIFY `description` TEXT NULL;

-- CreateTable
CREATE TABLE `proyect_details` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `proyectId` INTEGER NOT NULL,
    `type` VARCHAR(191) NULL,
    `investmentPeriod` INTEGER NULL,
    `surface` INTEGER NULL,
    `rooms` INTEGER NULL,
    `floors` INTEGER NULL,
    `features` JSON NULL,
    `buildingYear` INTEGER NULL,
    `riskScore` INTEGER NULL,
    `profitabilityScore` INTEGER NULL,

    UNIQUE INDEX `proyect_details_proyectId_key`(`proyectId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `proyect_found` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `proyectId` INTEGER NOT NULL,
    `startInvestDate` DATETIME(3) NULL,
    `endInvestDate` DATETIME(3) NULL,
    `startPreFundingDate` DATETIME(3) NULL,
    `endPreFundingDate` DATETIME(3) NULL,
    `companyCapital` DECIMAL(20, 2) NOT NULL DEFAULT 0.00,
    `quantityFunded` DECIMAL(20, 2) NOT NULL DEFAULT 0.00,
    `quantityToFund` DECIMAL(20, 2) NOT NULL DEFAULT 0.00,
    `maxOverfunding` DECIMAL(20, 2) NOT NULL DEFAULT 0.00,
    `investors` INTEGER NULL,
    `fields` JSON NULL,
    `rentProfitability` DECIMAL(20, 2) NOT NULL DEFAULT 0.00,
    `totalNetProfitability` DECIMAL(20, 2) NOT NULL DEFAULT 0.00,
    `totalNetProfitabilityToShow` DECIMAL(20, 2) NOT NULL DEFAULT 0.00,
    `apreciationProfitability` DECIMAL(20, 2) NOT NULL DEFAULT 0.00,

    UNIQUE INDEX `proyect_found_proyectId_key`(`proyectId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `project_media` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `proyectId` INTEGER NULL,
    `link` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `proyects` ADD CONSTRAINT `proyects_promotorId_fkey` FOREIGN KEY (`promotorId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `proyect_details` ADD CONSTRAINT `proyect_details_proyectId_fkey` FOREIGN KEY (`proyectId`) REFERENCES `proyects`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `proyect_found` ADD CONSTRAINT `proyect_found_proyectId_fkey` FOREIGN KEY (`proyectId`) REFERENCES `proyects`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `proyect_found` ADD CONSTRAINT `proyect_found_investors_fkey` FOREIGN KEY (`investors`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `project_media` ADD CONSTRAINT `project_media_proyectId_fkey` FOREIGN KEY (`proyectId`) REFERENCES `proyects`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
