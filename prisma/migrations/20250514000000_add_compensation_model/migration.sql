-- CreateTable
CREATE TABLE `proyect_compensations` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `proyectId` INTEGER NOT NULL,
  `fecha` DATETIME(3) NOT NULL,
  `mes` VARCHAR(191) NOT NULL,
  `detalle` TEXT NULL,
  `importePesos` DECIMAL(12, 2) NOT NULL,
  `precioDolarBlue` DECIMAL(12, 2) NOT NULL,
  `importeDolar` DECIMAL(12, 2) NOT NULL,
  `inversorOrigen` VARCHAR(191) NOT NULL,
  `inversorDestino` VARCHAR(191) NOT NULL,
  `usuarioId` INTEGER NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,

  PRIMARY KEY (`id`),
  INDEX (`proyectId`),
  INDEX (`usuarioId`),
  FOREIGN KEY (`proyectId`) REFERENCES `proyects`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`usuarioId`) REFERENCES `users`(`id`) ON DELETE RESTRICT
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
