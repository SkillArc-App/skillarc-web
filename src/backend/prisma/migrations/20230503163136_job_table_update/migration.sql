/*
  Warnings:

  - You are about to drop the column `logo` on the `Employer` table. All the data in the column will be lost.
  - Added the required column `logoUrl` to the `Employer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `schedule` to the `Job` table without a default value. This is not possible if the table is not empty.
  - Added the required column `workDays` to the `Job` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Employer" DROP COLUMN "logo",
ADD COLUMN     "logoUrl" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "hideJob" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "schedule" TEXT NOT NULL,
ADD COLUMN     "workDays" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "JobPhoto" (
    "id" TEXT NOT NULL,
    "photoUrl" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,

    CONSTRAINT "JobPhoto_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "JobPhoto" ADD CONSTRAINT "JobPhoto_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
