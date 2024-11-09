/*
  Warnings:

  - You are about to drop the column `descritorId` on the `RespostasDeProvas` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_RespostasDeProvas" (
    "provaId" INTEGER NOT NULL,
    "questaoId" INTEGER NOT NULL,
    "numeroQuestao" INTEGER NOT NULL,
    "aluno" TEXT NOT NULL,
    "itemMarcado" TEXT NOT NULL,
    "acertou" BOOLEAN NOT NULL,

    PRIMARY KEY ("provaId", "questaoId"),
    CONSTRAINT "RespostasDeProvas_provaId_fkey" FOREIGN KEY ("provaId") REFERENCES "Prova" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "RespostasDeProvas_questaoId_fkey" FOREIGN KEY ("questaoId") REFERENCES "Questao" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_RespostasDeProvas" ("acertou", "aluno", "itemMarcado", "numeroQuestao", "provaId", "questaoId") SELECT "acertou", "aluno", "itemMarcado", "numeroQuestao", "provaId", "questaoId" FROM "RespostasDeProvas";
DROP TABLE "RespostasDeProvas";
ALTER TABLE "new_RespostasDeProvas" RENAME TO "RespostasDeProvas";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
