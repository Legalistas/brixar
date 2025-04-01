-- AlterTable
ALTER TABLE `inquiries` ADD COLUMN `adminAccepted` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `clientAccepted` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `states` ALTER COLUMN `updatedAt` DROP DEFAULT;
