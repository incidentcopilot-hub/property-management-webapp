-- CreateEnum
CREATE TYPE "PropertyType" AS ENUM ('APARTMENT', 'HOUSE');

-- AlterTable
ALTER TABLE "Property" ADD COLUMN     "bathrooms" INTEGER,
ADD COLUMN     "bedrooms" INTEGER,
ADD COLUMN     "propertyType" "PropertyType" NOT NULL DEFAULT 'APARTMENT';
