-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Documents" (
    "id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "Documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Coments" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "document_id" TEXT NOT NULL,

    CONSTRAINT "Coments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Documents_filename_key" ON "Documents"("filename");

-- AddForeignKey
ALTER TABLE "Documents" ADD CONSTRAINT "Documents_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Coments" ADD CONSTRAINT "Coments_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "Documents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
