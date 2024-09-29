function entrarNoJogo() {
    const nome = document.getElementById("nome").value;
    const codigo = document.getElementById("codigo").value;

    if (nome && codigo) {
        alert(`Entrando no jogo com o nome ${nome} e código da sala ${codigo}`);
        
    } else {
        alert("Por favor, preencha ambos os campos.");
    }
}
