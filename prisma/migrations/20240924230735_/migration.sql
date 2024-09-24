/*
  Warnings:

  - Added the required column `explicacao` to the `Questao` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Questao" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "enunciado" TEXT NOT NULL,
    "alternativaA" TEXT,
    "alternativaB" TEXT,
    "alternativaC" TEXT,
    "alternativaD" TEXT,
    "alternativaE" TEXT,
    "respostaCorreta" TEXT NOT NULL,
    "explicacao" TEXT NOT NULL,
    "publica" BOOLEAN NOT NULL DEFAULT false,
    "professorId" INTEGER,
    "descritorId" INTEGER,
    "disciplina" TEXT NOT NULL,
    CONSTRAINT "Questao_professorId_fkey" FOREIGN KEY ("professorId") REFERENCES "Professor" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Questao_descritorId_fkey" FOREIGN KEY ("descritorId") REFERENCES "Descritor" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Questao" ("alternativaA", "alternativaB", "alternativaC", "alternativaD", "alternativaE", "descritorId", "disciplina", "enunciado", "id", "professorId", "publica", "respostaCorreta") SELECT "alternativaA", "alternativaB", "alternativaC", "alternativaD", "alternativaE", "descritorId", "disciplina", "enunciado", "id", "professorId", "publica", "respostaCorreta" FROM "Questao";
DROP TABLE "Questao";
ALTER TABLE "new_Questao" RENAME TO "Questao";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
