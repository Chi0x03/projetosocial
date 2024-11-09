/*
  Warnings:

  - You are about to alter the column `tempoDeResposta` on the `Ranking` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Ranking" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "provaId" INTEGER NOT NULL,
    "nomeAluno" TEXT NOT NULL,
    "totalAcertos" INTEGER NOT NULL,
    "tempoDeResposta" INTEGER NOT NULL,
    "dataCriacao" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Ranking_provaId_fkey" FOREIGN KEY ("provaId") REFERENCES "Prova" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Ranking" ("dataCriacao", "id", "nomeAluno", "provaId", "tempoDeResposta", "totalAcertos") SELECT "dataCriacao", "id", "nomeAluno", "provaId", "tempoDeResposta", "totalAcertos" FROM "Ranking";
DROP TABLE "Ranking";
ALTER TABLE "new_Ranking" RENAME TO "Ranking";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
