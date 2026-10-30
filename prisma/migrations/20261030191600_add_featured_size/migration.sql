-- CreateEnum
CREATE TYPE "FeaturedSize" AS ENUM ('COMPACT', 'TALL');

-- AlterTable
ALTER TABLE "links" ADD COLUMN "featuredSize" "FeaturedSize" NOT NULL DEFAULT 'COMPACT';
