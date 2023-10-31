/*
  Warnings:

  - You are about to drop the column `employmentLength` on the `Testimonial` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Employer" ALTER COLUMN "location" DROP NOT NULL,
ALTER COLUMN "logoUrl" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Job" ALTER COLUMN "responsibilitiesDescription" DROP NOT NULL,
ALTER COLUMN "schedule" DROP NOT NULL,
ALTER COLUMN "workDays" DROP NOT NULL,
ALTER COLUMN "requirementsDescription" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Testimonial" DROP COLUMN "employmentLength",
ADD COLUMN     "photoUrl" TEXT;
