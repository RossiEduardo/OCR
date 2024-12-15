/*
  Warnings:

  - You are about to drop the `Coments` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Coments" DROP CONSTRAINT "Coments_document_id_fkey";

-- DropTable
DROP TABLE "Coments";

-- CreateTable
CREATE TABLE "LLMComents" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "document_id" TEXT NOT NULL,

    CONSTRAINT "LLMComents_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "LLMComents" ADD CONSTRAINT "LLMComents_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "Documents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
