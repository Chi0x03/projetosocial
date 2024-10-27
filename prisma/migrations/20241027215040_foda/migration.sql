-- CreateTable
CREATE TABLE "Aluno" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT
);

-- CreateTable
CREATE TABLE "Conquistas" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT
);

-- CreateTable
CREATE TABLE "Ranking" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT
);

-- CreateTable
CREATE TABLE "Professor" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "instituicao" TEXT,
    "disciplina" TEXT
);

-- CreateTable
CREATE TABLE "Descritor" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ano" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "disciplina" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Questao" (
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

-- CreateTable
CREATE TABLE "Prova" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titulo" TEXT NOT NULL,
    "dataCriacao" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "professorId" INTEGER,
    CONSTRAINT "Prova_professorId_fkey" FOREIGN KEY ("professorId") REFERENCES "Professor" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProvasQuestoes" (
    "provaId" INTEGER NOT NULL,
    "questaoId" INTEGER NOT NULL,
    "numeroQuestao" INTEGER NOT NULL,

    PRIMARY KEY ("provaId", "questaoId"),
    CONSTRAINT "ProvasQuestoes_provaId_fkey" FOREIGN KEY ("provaId") REFERENCES "Prova" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ProvasQuestoes_questaoId_fkey" FOREIGN KEY ("questaoId") REFERENCES "Questao" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RespostasDeProvas" (
    "provaId" INTEGER NOT NULL,
    "questaoId" INTEGER NOT NULL,
    "aluno" TEXT NOT NULL,
    "itemMarcado" TEXT NOT NULL,

    PRIMARY KEY ("provaId", "questaoId"),
    CONSTRAINT "RespostasDeProvas_provaId_fkey" FOREIGN KEY ("provaId") REFERENCES "Prova" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "RespostasDeProvas_questaoId_fkey" FOREIGN KEY ("questaoId") REFERENCES "Questao" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Professor_email_key" ON "Professor"("email");
