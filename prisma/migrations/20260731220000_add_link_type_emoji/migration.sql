-- CreateEnum
CREATE TYPE "LinkType" AS ENUM ('CLASSIC', 'SOCIAL');

-- AlterTable
ALTER TABLE "links" ADD COLUMN "emoji" TEXT,
ADD COLUMN "type" "LinkType" NOT NULL DEFAULT 'CLASSIC';
