-- AlterTable
ALTER TABLE `property_videos` ADD COLUMN `isPublished` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `states` ALTER COLUMN `updatedAt` DROP DEFAULT;
