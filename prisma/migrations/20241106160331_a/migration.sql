/*
  Warnings:

  - You are about to alter the column `tempoDeResposta` on the `Ranking` table. The data in that column could be lost. The data in that column will be cast from `Int` to `BigInt`.
  - You are about to drop the column `numeroQuestao` on the `RespostasDeProvas` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Ranking" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "provaId" INTEGER NOT NULL,
    "nomeAluno" TEXT NOT NULL,
    "totalAcertos" INTEGER NOT NULL,
    "tempoDeResposta" BIGINT NOT NULL,
    "dataCriacao" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Ranking_provaId_fkey" FOREIGN KEY ("provaId") REFERENCES "Prova" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Ranking" ("dataCriacao", "id", "nomeAluno", "provaId", "tempoDeResposta", "totalAcertos") SELECT "dataCriacao", "id", "nomeAluno", "provaId", "tempoDeResposta", "totalAcertos" FROM "Ranking";
DROP TABLE "Ranking";
ALTER TABLE "new_Ranking" RENAME TO "Ranking";
CREATE TABLE "new_RespostasDeProvas" (
    "provaId" INTEGER NOT NULL,
    "questaoId" INTEGER NOT NULL,
    "dataDeProva" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "aluno" TEXT NOT NULL,
    "itemMarcado" TEXT NOT NULL,
    "acertou" BOOLEAN NOT NULL,

    PRIMARY KEY ("provaId", "questaoId"),
    CONSTRAINT "RespostasDeProvas_provaId_fkey" FOREIGN KEY ("provaId") REFERENCES "Prova" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "RespostasDeProvas_questaoId_fkey" FOREIGN KEY ("questaoId") REFERENCES "Questao" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_RespostasDeProvas" ("acertou", "aluno", "itemMarcado", "provaId", "questaoId") SELECT "acertou", "aluno", "itemMarcado", "provaId", "questaoId" FROM "RespostasDeProvas";
DROP TABLE "RespostasDeProvas";
ALTER TABLE "new_RespostasDeProvas" RENAME TO "RespostasDeProvas";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
