-- CreateTable
CREATE TABLE "AdminEmailVerify" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "expirationTime" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "systemName" TEXT NOT NULL,

    CONSTRAINT "AdminEmailVerify_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AdminEmailVerify_systemName_key" ON "AdminEmailVerify"("systemName");

-- AddForeignKey
ALTER TABLE "AdminEmailVerify" ADD CONSTRAINT "AdminEmailVerify_systemName_fkey" FOREIGN KEY ("systemName") REFERENCES "System"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
