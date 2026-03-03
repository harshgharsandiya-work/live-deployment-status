-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "repoName" TEXT NOT NULL,
    "commitSha" TEXT,
    "branch" TEXT,
    "status" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "message" TEXT,
    "author" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);
