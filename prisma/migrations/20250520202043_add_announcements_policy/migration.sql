-- AlterTable
ALTER TABLE "Conference" ADD COLUMN     "announcements" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "policyText" TEXT;
