/*
  Warnings:

  - You are about to drop the `project_media` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `project_media` DROP FOREIGN KEY `project_media_proyectId_fkey`;

-- DropTable
DROP TABLE `project_media`;

-- CreateTable
CREATE TABLE `proyect_media` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `proyectId` INTEGER NULL,
    `link` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `proyect_media` ADD CONSTRAINT `proyect_media_proyectId_fkey` FOREIGN KEY (`proyectId`) REFERENCES `proyects`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
