const tabuleiro = document.getElementById("game-board");
const visorTempo = document.getElementById("timer");
const visorPontos = document.getElementById("score");
const btnResetar = document.getElementById("reset-btn");
const msgFimJogo = document.getElementById("end-message");

let icones = ["⚽", "🏟️", "🧤", "👕", "🥅", "🏆", "🦶", "🧑‍⚖️"]; 
let cartas = [];
let primeiraCarta = null;
let segundaCarta = null;
let travarJogo = false;
let pontuacao = 0;
let paresEncontrados = 0;
let tempoRestante = 60;
let intervaloTempo = null;

const somAcerto = new Audio('acerto.mp3'); 
const somErro = new Audio('erro.mp3'); 

function iniciarJogo() {
    cartas = duplicarIcones(icones);
    embaralharCartas(cartas);
    criarCartasNoTabuleiro(cartas);
    iniciarContadorRegressivo();
    msgFimJogo.textContent = "";
}

function duplicarIcones(lista) {
    let pares = [];
    for (let i = 0; i < lista.length; i++) {
        pares.push(lista[i]);
        pares.push(lista[i]);
    }
    return pares;
}

function embaralharCartas(lista) {
    for (let i = lista.length - 1; i > 0; i--) {
        let cartaSorteada = Math.floor(Math.random() * (i + 1));
        [lista[i], lista[cartaSorteada]] = [lista[cartaSorteada], lista[i]];
    }
}

function criarCartasNoTabuleiro(listaCartas) {
    tabuleiro.innerHTML = "";
    
    for (let i = 0; i < listaCartas.length; i++) {
        let carta = document.createElement("div");
        carta.classList.add("card");
        carta.dataset.icone = listaCartas[i];
        carta.textContent = "?";
        carta.addEventListener("click", function() {
            virarCarta(carta);
        });
        tabuleiro.appendChild(carta);
    }
}

function iniciarContadorRegressivo() {
    visorTempo.textContent = tempoRestante;
    intervaloTempo = setInterval(function() {
        tempoRestante--;
        visorTempo.textContent = tempoRestante;
        if (tempoRestante === 0) {
            finalizarJogo(false);
        }
    }, 1000);
}

function virarCarta(carta) {
    if (travarJogo || carta.classList.contains("card-revealed") || carta === primeiraCarta) {
        return;
    }

    carta.textContent = carta.dataset.icone;
    carta.classList.add("card-revealed");

    if (!primeiraCarta) {
        primeiraCarta = carta;
        return;
    }

    segundaCarta = carta;
    travarJogo = true;

    verificarSeEhPar();
}

function esconderCartas() {
    primeiraCarta.textContent = "?";
    segundaCarta.textContent = "?";
    primeiraCarta.classList.remove("card-revealed");
    segundaCarta.classList.remove("card-revealed");
    limparCartasSelecionadas();
}

function limparCartasSelecionadas() {
    primeiraCarta = null;
    segundaCarta = null;
    travarJogo = false;
}

function verificarSeEhPar() {
    if (primeiraCarta.dataset.icone === segundaCarta.dataset.icone) {
        pontuacao++;
        paresEncontrados++;
        visorPontos.textContent = pontuacao;
        somAcerto.play();
        limparCartasSelecionadas();

        if (paresEncontrados === icones.length) {
            finalizarJogo(true);
        }
    } else {
        somErro.play();
        setTimeout(function() {
            esconderCartas();
        }, 1000);
    }
}

function finalizarJogo(vitoria) {
    clearInterval(intervaloTempo);
    msgFimJogo.textContent = vitoria ? "Parabéns! Você venceu!" : "Tempo esgotado! Você perdeu.";
    msgFimJogo.style.display = "block";
}

btnResetar.addEventListener("click", function() {
    pontuacao = 0;
    paresEncontrados = 0;
    tempoRestante = 60;
    visorTempo.textContent = tempoRestante;
    visorPontos.textContent = pontuacao;
    iniciarJogo();
    msgFimJogo.textContent = "";
    msgFimJogo.style.display = "none";
});

iniciarJogo();
