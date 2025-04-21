-- AlterTable
ALTER TABLE `states` ALTER COLUMN `updatedAt` DROP DEFAULT;

-- CreateTable
CREATE TABLE `proyect_costs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `proyectId` INTEGER NOT NULL,
    `fecha` DATETIME(3) NOT NULL,
    `mes` VARCHAR(191) NOT NULL,
    `rubro` VARCHAR(191) NOT NULL,
    `proveedor` VARCHAR(191) NOT NULL,
    `detalle` TEXT NULL,
    `importePesos` DECIMAL(12, 2) NOT NULL,
    `precioDolarBlue` DECIMAL(12, 2) NOT NULL,
    `importeDolar` DECIMAL(12, 2) NOT NULL,
    `usuarioId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `proyect_costs_proyectId_idx`(`proyectId`),
    INDEX `proyect_costs_usuarioId_idx`(`usuarioId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `proyect_costs` ADD CONSTRAINT `proyect_costs_proyectId_fkey` FOREIGN KEY (`proyectId`) REFERENCES `proyects`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `proyect_costs` ADD CONSTRAINT `proyect_costs_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
