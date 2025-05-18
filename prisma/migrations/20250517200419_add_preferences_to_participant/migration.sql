-- AlterTable
ALTER TABLE "ConferenceParticipant" ADD COLUMN     "committeePref1" TEXT,
ADD COLUMN     "committeePref2" TEXT,
ADD COLUMN     "committeePref3" TEXT,
ADD COLUMN     "portfolio" TEXT,
ADD COLUMN     "portfolioPref1" TEXT,
ADD COLUMN     "portfolioPref2" TEXT,
ADD COLUMN     "portfolioPref3" TEXT,
ADD COLUMN     "remarks" TEXT,
ALTER COLUMN "committee" DROP NOT NULL;
