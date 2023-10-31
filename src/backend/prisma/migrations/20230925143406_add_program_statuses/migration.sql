-- CreateTable
CREATE TABLE "seeker_training_provider_program_statuses" (
    "id" TEXT NOT NULL,
    "seeker_training_provider_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'enrolled',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "seeker_training_provider_program_statuses_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "seeker_training_provider_program_statuses" ADD CONSTRAINT "seeker_training_provider_program_statuses_seeker_training__fkey" FOREIGN KEY ("seeker_training_provider_id") REFERENCES "SeekerTrainingProvider"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
