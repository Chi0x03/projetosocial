//ta faltando conectar essa bct com o banco de dados, porem estou sem o database... daqui uns dias eu termino 100%, por enquanto é so a logica.

class Jogador {
    constructor(nome, acertos, temposRespostas) {
        this.nome = nome;
        this.acertos = acertos;
        this.temposRespostas = temposRespostas;
    }

    mediaTempoResposta() {
        if (this.acertos === 0) {
            return Infinity;
        }
        const somaTempos = this.temposRespostas.reduce((a, b) => a + b, 0);
        return somaTempos / this.acertos;
    }

    exibirResultados() {
        const mediaTempo = this.mediaTempoResposta().toFixed(2);
        console.log(`${this.nome} - ${this.acertos} acertos, média de tempo: ${mediaTempo} segundos.`);
    }
}

function definirVencedor(jogadores) {
    jogadores.sort((a, b) => {
        if (b.acertos !== a.acertos) {
            return b.acertos - a.acertos;
        }
        return a.mediaTempoResposta() - b.mediaTempoResposta();
    });

    return jogadores;
}

const jogadores = [
    new Jogador("Jogador 1", 18, [30, 28, 35, 40, 32, 36, 33, 34, 35, 38, 32, 31, 30, 29, 33, 37, 39, 40]),
    new Jogador("Jogador 2", 18, [25, 30, 29, 27, 26, 28, 25, 29, 30, 31, 26, 25, 28, 29, 27, 28, 30, 31]),
    new Jogador("Jogador 3", 20, [40, 38, 42, 45, 44, 41, 43, 40, 39, 38, 42, 45, 44, 43, 41, 40, 39, 38, 37, 36]),
    new Jogador("Jogador 4", 17, [25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41])
];

const jogadoresOrdenados = definirVencedor(jogadores);

for (let i = 0; i < 3; i++) {
    if (jogadoresOrdenados[i]) {
        console.log(`Colocado ${i + 1}:`);
        jogadoresOrdenados[i].exibirResultados();
    }
}
