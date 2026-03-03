/*
  Warnings:

  - You are about to drop the `Event` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Event";

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "githubId" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT,
    "accessToken" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Repositories" (
    "id" TEXT NOT NULL,
    "githubRepoId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "fullname" TEXT NOT NULL,
    "webhookSecret" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Repositories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GithubEvent" (
    "id" TEXT NOT NULL,
    "githubEventId" TEXT NOT NULL,
    "repositoryId" TEXT NOT NULL,
    "commitSha" TEXT,
    "branch" TEXT,
    "status" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "message" TEXT,
    "author" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GithubEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_githubId_key" ON "User"("githubId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Repositories_githubRepoId_key" ON "Repositories"("githubRepoId");

-- CreateIndex
CREATE UNIQUE INDEX "GithubEvent_githubEventId_key" ON "GithubEvent"("githubEventId");

-- AddForeignKey
ALTER TABLE "Repositories" ADD CONSTRAINT "Repositories_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GithubEvent" ADD CONSTRAINT "GithubEvent_repositoryId_fkey" FOREIGN KEY ("repositoryId") REFERENCES "Repositories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
