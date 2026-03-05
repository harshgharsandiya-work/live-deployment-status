/*
  Warnings:

  - A unique constraint covering the columns `[fullname]` on the table `Repositories` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Repositories_fullname_key" ON "Repositories"("fullname");
