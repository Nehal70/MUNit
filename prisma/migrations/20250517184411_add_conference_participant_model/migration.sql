/*
  Warnings:

  - You are about to drop the `_ConferenceParticipants` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ConferenceParticipants" DROP CONSTRAINT "_ConferenceParticipants_A_fkey";

-- DropForeignKey
ALTER TABLE "_ConferenceParticipants" DROP CONSTRAINT "_ConferenceParticipants_B_fkey";

-- DropTable
DROP TABLE "_ConferenceParticipants";

-- CreateTable
CREATE TABLE "ConferenceParticipant" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "conferenceId" TEXT NOT NULL,
    "committee" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConferenceParticipant_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ConferenceParticipant_userId_conferenceId_key" ON "ConferenceParticipant"("userId", "conferenceId");

-- AddForeignKey
ALTER TABLE "ConferenceParticipant" ADD CONSTRAINT "ConferenceParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConferenceParticipant" ADD CONSTRAINT "ConferenceParticipant_conferenceId_fkey" FOREIGN KEY ("conferenceId") REFERENCES "Conference"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
