-- CreateEnum
CREATE TYPE "PageLayout" AS ENUM ('CLASSIC', 'COVER');

-- AlterTable
ALTER TABLE "pages" ADD COLUMN "layout" "PageLayout" NOT NULL DEFAULT 'CLASSIC';
