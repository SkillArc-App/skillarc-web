-- RenameForeignKey
ALTER TABLE "Preference" RENAME CONSTRAINT "Preference_profileId_fkey" TO "Preference_profile_id_fkey";

-- RenameIndex
ALTER INDEX "Preference_profileId_key" RENAME TO "Preference_profile_id_key";
