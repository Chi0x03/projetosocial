-- CreateTable
CREATE TABLE "Aluno" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "Aluno_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Conquistas" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "Conquistas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ranking" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "Ranking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Professor" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,

    CONSTRAINT "Professor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Descritor" (
    "id" SERIAL NOT NULL,
    "ano" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "disciplina" TEXT NOT NULL,

    CONSTRAINT "Descritor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Questao" (
    "id" SERIAL NOT NULL,
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

    CONSTRAINT "Questao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Prova" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "dataCriacao" TIMESTAMP(3) NOT NULL,
    "professorId" INTEGER,

    CONSTRAINT "Prova_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProvasQuestoes" (
    "provaId" INTEGER NOT NULL,
    "questaoId" INTEGER NOT NULL,

    CONSTRAINT "ProvasQuestoes_pkey" PRIMARY KEY ("provaId","questaoId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Professor_email_key" ON "Professor"("email");

-- AddForeignKey
ALTER TABLE "Questao" ADD CONSTRAINT "Questao_professorId_fkey" FOREIGN KEY ("professorId") REFERENCES "Professor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Questao" ADD CONSTRAINT "Questao_descritorId_fkey" FOREIGN KEY ("descritorId") REFERENCES "Descritor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prova" ADD CONSTRAINT "Prova_professorId_fkey" FOREIGN KEY ("professorId") REFERENCES "Professor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProvasQuestoes" ADD CONSTRAINT "ProvasQuestoes_provaId_fkey" FOREIGN KEY ("provaId") REFERENCES "Prova"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProvasQuestoes" ADD CONSTRAINT "ProvasQuestoes_questaoId_fkey" FOREIGN KEY ("questaoId") REFERENCES "Questao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
