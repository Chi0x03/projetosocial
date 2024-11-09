/*
  Warnings:

  - You are about to drop the `Aluno` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Conquistas` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `nomeAluno` to the `Ranking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `provaId` to the `Ranking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tempoDeResposta` to the `Ranking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalAcertos` to the `Ranking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Professor" ADD COLUMN     "disciplina" TEXT,
ADD COLUMN     "instituicao" TEXT;

-- AlterTable
ALTER TABLE "Prova" ALTER COLUMN "dataCriacao" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Ranking" ADD COLUMN     "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "nomeAluno" TEXT NOT NULL,
ADD COLUMN     "provaId" INTEGER NOT NULL,
ADD COLUMN     "tempoDeResposta" INTEGER NOT NULL,
ADD COLUMN     "totalAcertos" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Aluno";

-- DropTable
DROP TABLE "Conquistas";

-- CreateTable
CREATE TABLE "RespostasDeProvas" (
    "id" SERIAL NOT NULL,
    "provaId" INTEGER NOT NULL,
    "questaoId" INTEGER NOT NULL,
    "dataDeProva" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "aluno" TEXT NOT NULL,
    "itemMarcado" TEXT NOT NULL,
    "acertou" BOOLEAN NOT NULL,

    CONSTRAINT "RespostasDeProvas_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Ranking" ADD CONSTRAINT "Ranking_provaId_fkey" FOREIGN KEY ("provaId") REFERENCES "Prova"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RespostasDeProvas" ADD CONSTRAINT "RespostasDeProvas_provaId_fkey" FOREIGN KEY ("provaId") REFERENCES "Prova"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RespostasDeProvas" ADD CONSTRAINT "RespostasDeProvas_questaoId_fkey" FOREIGN KEY ("questaoId") REFERENCES "Questao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
