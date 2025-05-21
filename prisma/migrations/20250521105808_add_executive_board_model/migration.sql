-- CreateTable
CREATE TABLE "ExecutiveBoard" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "committee" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "conferenceId" TEXT NOT NULL,

    CONSTRAINT "ExecutiveBoard_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ExecutiveBoard_userId_conferenceId_key" ON "ExecutiveBoard"("userId", "conferenceId");

-- AddForeignKey
ALTER TABLE "ExecutiveBoard" ADD CONSTRAINT "ExecutiveBoard_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExecutiveBoard" ADD CONSTRAINT "ExecutiveBoard_conferenceId_fkey" FOREIGN KEY ("conferenceId") REFERENCES "Conference"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
