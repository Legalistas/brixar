-- AddSaleDetailedFields
-- Añadir campos detallados a la tabla de ventas

ALTER TABLE `sales` ADD COLUMN `buyerDocumentType` VARCHAR(191) NULL;
ALTER TABLE `sales` ADD COLUMN `buyerDocumentNumber` VARCHAR(191) NULL;
ALTER TABLE `sales` ADD COLUMN `buyerAddress` VARCHAR(191) NULL;
ALTER TABLE `sales` ADD COLUMN `buyerPhone` VARCHAR(191) NULL;
ALTER TABLE `sales` ADD COLUMN `saleDate` DATETIME(3) NULL;
ALTER TABLE `sales` ADD COLUMN `contractNumber` VARCHAR(191) NULL;
ALTER TABLE `sales` ADD COLUMN `signingPlace` VARCHAR(191) NULL;
ALTER TABLE `sales` ADD COLUMN `totalAmount` DECIMAL(12,2) NULL;
ALTER TABLE `sales` ADD COLUMN `downPayment` DECIMAL(12,2) NULL;
ALTER TABLE `sales` ADD COLUMN `financedAmount` DECIMAL(12,2) NULL;
ALTER TABLE `sales` ADD COLUMN `financingTermMonths` INTEGER NULL;
ALTER TABLE `sales` ADD COLUMN `interestRate` DECIMAL(5,2) NULL;
ALTER TABLE `sales` ADD COLUMN `monthlyPayment` DECIMAL(12,2) NULL;
ALTER TABLE `sales` ADD COLUMN `legalExpenses` DECIMAL(12,2) NULL;
ALTER TABLE `sales` ADD COLUMN `transferTaxes` DECIMAL(12,2) NULL;
ALTER TABLE `sales` ADD COLUMN `notaryFees` DECIMAL(12,2) NULL;
ALTER TABLE `sales` ADD COLUMN `registrationFees` DECIMAL(12,2) NULL;
