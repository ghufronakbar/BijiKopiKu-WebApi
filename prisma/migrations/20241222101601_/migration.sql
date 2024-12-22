/*
  Warnings:

  - Added the required column `desc` to the `Coffee` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Coffee` ADD COLUMN `desc` TEXT NOT NULL,
    ADD COLUMN `picture` VARCHAR(191) NOT NULL DEFAULT '/logo.png';
