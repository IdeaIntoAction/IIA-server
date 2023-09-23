/*
  Warnings:

  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CategoryOnPost` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Tag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TagOnPost` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CategoryOnPost" DROP CONSTRAINT "CategoryOnPost_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "CategoryOnPost" DROP CONSTRAINT "CategoryOnPost_postId_fkey";

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_authorId_fkey";

-- DropForeignKey
ALTER TABLE "TagOnPost" DROP CONSTRAINT "TagOnPost_postId_fkey";

-- DropForeignKey
ALTER TABLE "TagOnPost" DROP CONSTRAINT "TagOnPost_tagId_fkey";

-- DropTable
DROP TABLE "Category";

-- DropTable
DROP TABLE "CategoryOnPost";

-- DropTable
DROP TABLE "Post";

-- DropTable
DROP TABLE "Tag";

-- DropTable
DROP TABLE "TagOnPost";

-- CreateTable
CREATE TABLE "Parser" (
    "id" SERIAL NOT NULL,
    "authorId" INTEGER NOT NULL,
    "site" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Parser_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Parser" ADD CONSTRAINT "Parser_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
