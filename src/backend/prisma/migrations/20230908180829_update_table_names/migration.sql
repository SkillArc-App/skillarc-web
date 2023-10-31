-- This is an empty migration.

-- alter preference table to be snake cased column names
ALTER TABLE "public"."Preference" RENAME COLUMN "emailConsent" TO "email_consent";
ALTER TABLE "public"."Preference" RENAME COLUMN "informationConsent" TO "information_consent";
ALTER TABLE "public"."Preference" RENAME COLUMN "profileId" TO "profile_id";
ALTER TABLE "public"."Preference" RENAME COLUMN "createdAt" TO "created_at";
ALTER TABLE "public"."Preference" RENAME COLUMN "updatedAt" TO "updated_at";
