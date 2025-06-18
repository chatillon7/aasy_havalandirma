-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_HomepageContent" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "sliderImages" TEXT NOT NULL,
    "videoUrl" TEXT NOT NULL,
    "purpose" TEXT NOT NULL,
    "info" TEXT NOT NULL
);
INSERT INTO "new_HomepageContent" ("id", "info", "purpose", "sliderImages", "videoUrl") SELECT "id", "info", "purpose", "sliderImages", "videoUrl" FROM "HomepageContent";
DROP TABLE "HomepageContent";
ALTER TABLE "new_HomepageContent" RENAME TO "HomepageContent";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
