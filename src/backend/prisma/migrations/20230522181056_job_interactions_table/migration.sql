-- CreateTable
CREATE TABLE IF NOT EXISTS "JobInteraction" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "hasViewed" BOOLEAN DEFAULT false,
    "percentMatch" INTEGER,
    "intentToApply" BOOLEAN DEFAULT false,

    CONSTRAINT "JobInteraction_pkey" PRIMARY KEY ("id")
);

-- DropForeignKey
ALTER TABLE "JobInteraction" DROP CONSTRAINT IF EXISTS "JobInteraction_jobId_fkey";

-- DropForeignKey
ALTER TABLE "JobInteraction" DROP CONSTRAINT IF EXISTS "JobInteraction_userId_fkey";

-- AddForeignKey
ALTER TABLE "JobInteraction" ADD CONSTRAINT "JobInteraction_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobInteraction" ADD CONSTRAINT "JobInteraction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
