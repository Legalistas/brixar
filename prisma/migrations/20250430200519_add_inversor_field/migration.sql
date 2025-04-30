-- AlterTable
ALTER TABLE `proyect_costs` ADD COLUMN `inversor` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `states` ALTER COLUMN `updatedAt` DROP DEFAULT;
