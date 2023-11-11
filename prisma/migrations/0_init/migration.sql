-- CreateTable
CREATE TABLE "Proposer" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(255) NOT NULL,

    CONSTRAINT "Proposer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Proposer_email_key" ON "Proposer"("email");

