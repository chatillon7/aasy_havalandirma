/*
  Warnings:

  - You are about to drop the column `sliderImages` on the `HomepageContent` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_HomepageContent" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "videoUrl" TEXT NOT NULL,
    "purpose" TEXT NOT NULL,
    "info" TEXT NOT NULL DEFAULT ''
);
INSERT INTO "new_HomepageContent" ("id", "info", "purpose", "videoUrl") SELECT "id", "info", "purpose", "videoUrl" FROM "HomepageContent";
DROP TABLE "HomepageContent";
ALTER TABLE "new_HomepageContent" RENAME TO "HomepageContent";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
