/*
  Warnings:

  - Added the required column `filepath` to the `Documents` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Documents" ADD COLUMN     "filepath" TEXT NOT NULL;
