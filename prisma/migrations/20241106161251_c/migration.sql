/*
  Warnings:

  - The primary key for the `RespostasDeProvas` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `id` to the `RespostasDeProvas` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_RespostasDeProvas" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "provaId" INTEGER NOT NULL,
    "questaoId" INTEGER NOT NULL,
    "dataDeProva" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "aluno" TEXT NOT NULL,
    "itemMarcado" TEXT NOT NULL,
    "acertou" BOOLEAN NOT NULL,
    CONSTRAINT "RespostasDeProvas_provaId_fkey" FOREIGN KEY ("provaId") REFERENCES "Prova" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "RespostasDeProvas_questaoId_fkey" FOREIGN KEY ("questaoId") REFERENCES "Questao" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_RespostasDeProvas" ("acertou", "aluno", "dataDeProva", "itemMarcado", "provaId", "questaoId") SELECT "acertou", "aluno", "dataDeProva", "itemMarcado", "provaId", "questaoId" FROM "RespostasDeProvas";
DROP TABLE "RespostasDeProvas";
ALTER TABLE "new_RespostasDeProvas" RENAME TO "RespostasDeProvas";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
