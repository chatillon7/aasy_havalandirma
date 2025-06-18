/*
  Warnings:

  - You are about to drop the column `faviconUrl` on the `SiteSettings` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SiteSettings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "logoUrl" TEXT NOT NULL,
    "tabTitle" TEXT NOT NULL,
    "siteName" TEXT NOT NULL
);
INSERT INTO "new_SiteSettings" ("id", "logoUrl", "siteName", "tabTitle") SELECT "id", "logoUrl", "siteName", "tabTitle" FROM "SiteSettings";
DROP TABLE "SiteSettings";
ALTER TABLE "new_SiteSettings" RENAME TO "SiteSettings";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
