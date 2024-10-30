/*
  Warnings:

  - You are about to drop the `Aluno` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Conquistas` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `numeroQuestao` on the `ProvasQuestoes` table. All the data in the column will be lost.
  - Added the required column `nomeAluno` to the `Ranking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `provaId` to the `Ranking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tempoDeResposta` to the `Ranking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalAcertos` to the `Ranking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `acertou` to the `RespostasDeProvas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `descritorId` to the `RespostasDeProvas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numeroQuestao` to the `RespostasDeProvas` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Aluno";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Conquistas";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ProvasQuestoes" (
    "provaId" INTEGER NOT NULL,
    "questaoId" INTEGER NOT NULL,

    PRIMARY KEY ("provaId", "questaoId"),
    CONSTRAINT "ProvasQuestoes_provaId_fkey" FOREIGN KEY ("provaId") REFERENCES "Prova" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ProvasQuestoes_questaoId_fkey" FOREIGN KEY ("questaoId") REFERENCES "Questao" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ProvasQuestoes" ("provaId", "questaoId") SELECT "provaId", "questaoId" FROM "ProvasQuestoes";
DROP TABLE "ProvasQuestoes";
ALTER TABLE "new_ProvasQuestoes" RENAME TO "ProvasQuestoes";
CREATE TABLE "new_Ranking" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "provaId" INTEGER NOT NULL,
    "nomeAluno" TEXT NOT NULL,
    "totalAcertos" INTEGER NOT NULL,
    "tempoDeResposta" INTEGER NOT NULL,
    "dataCriacao" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Ranking_provaId_fkey" FOREIGN KEY ("provaId") REFERENCES "Prova" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Ranking" ("id") SELECT "id" FROM "Ranking";
DROP TABLE "Ranking";
ALTER TABLE "new_Ranking" RENAME TO "Ranking";
CREATE TABLE "new_RespostasDeProvas" (
    "provaId" INTEGER NOT NULL,
    "questaoId" INTEGER NOT NULL,
    "descritorId" INTEGER NOT NULL,
    "numeroQuestao" INTEGER NOT NULL,
    "aluno" TEXT NOT NULL,
    "itemMarcado" TEXT NOT NULL,
    "acertou" BOOLEAN NOT NULL,

    PRIMARY KEY ("provaId", "questaoId"),
    CONSTRAINT "RespostasDeProvas_provaId_fkey" FOREIGN KEY ("provaId") REFERENCES "Prova" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "RespostasDeProvas_questaoId_fkey" FOREIGN KEY ("questaoId") REFERENCES "Questao" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "RespostasDeProvas_descritorId_fkey" FOREIGN KEY ("descritorId") REFERENCES "Descritor" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_RespostasDeProvas" ("aluno", "itemMarcado", "provaId", "questaoId") SELECT "aluno", "itemMarcado", "provaId", "questaoId" FROM "RespostasDeProvas";
DROP TABLE "RespostasDeProvas";
ALTER TABLE "new_RespostasDeProvas" RENAME TO "RespostasDeProvas";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
