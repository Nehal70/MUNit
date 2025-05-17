-- CreateTable
CREATE TABLE "Conference" (
    "id" TEXT NOT NULL,
    "organiserEmail" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "participationFee" DOUBLE PRECISION NOT NULL,
    "paymentDetails" TEXT NOT NULL,
    "venue" TEXT NOT NULL,
    "contactDetails" TEXT NOT NULL,
    "logo" BYTEA,
    "committees" TEXT[],
    "agendas" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Conference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ConferenceParticipants" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ConferenceParticipants_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ConferenceParticipants_B_index" ON "_ConferenceParticipants"("B");

-- AddForeignKey
ALTER TABLE "_ConferenceParticipants" ADD CONSTRAINT "_ConferenceParticipants_A_fkey" FOREIGN KEY ("A") REFERENCES "Conference"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ConferenceParticipants" ADD CONSTRAINT "_ConferenceParticipants_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
