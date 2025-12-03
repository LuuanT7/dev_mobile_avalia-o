/*
  Warnings:

  - You are about to drop the `class` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `enrollment` DROP FOREIGN KEY `Enrollment_classId_fkey`;

-- DropForeignKey
ALTER TABLE `message` DROP FOREIGN KEY `Message_classId_fkey`;

-- DropIndex
DROP INDEX `Enrollment_classId_fkey` ON `enrollment`;

-- DropIndex
DROP INDEX `Message_classId_fkey` ON `message`;

-- DropTable
DROP TABLE `class`;

-- CreateTable
CREATE TABLE `ClassRoom` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `ageRange` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Enrollment` ADD CONSTRAINT `Enrollment_classId_fkey` FOREIGN KEY (`classId`) REFERENCES `ClassRoom`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Message` ADD CONSTRAINT `Message_classId_fkey` FOREIGN KEY (`classId`) REFERENCES `ClassRoom`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
