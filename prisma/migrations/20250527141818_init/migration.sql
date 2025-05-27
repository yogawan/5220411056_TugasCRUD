-- CreateTable
CREATE TABLE "product_brands" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "brand_name" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "product_catalogs" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "product_name" TEXT,
    "type" TEXT,
    "brand_id" INTEGER,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "product_catalogs_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "product_brands" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
