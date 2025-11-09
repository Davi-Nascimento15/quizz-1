var nome = "";
var dificuldade = 0;
var acertos = 0;
var questoes = null;
var questaoatual = 1;
var tempoIntervalo = null;
var bloquear = false;

LerQuestao();

function DefinirNome() {
  nome = document.getElementById("nome-jogador").value;
  document.getElementById("nome").classList.add("hidden");
  document.getElementById("dificuldade").classList.remove("hidden");
}

function DefinirDificuldade(nivel) {
  dificuldade = nivel;
  document.getElementById("dificuldade").classList.add("hidden");
  document.getElementById("jogo").classList.remove("hidden");
  questoes.perguntas = questoes.perguntas.filter(x=>x.dificuldade == dificuldade);
  ProximaQuestao();
}

function LerQuestao() {
  fetch("../data.json")
    .then((resposta) => resposta.json())
    .then((json) => {
      questoes = json;
      console.log(questoes);
    });
}

function ProximaQuestao() {
  if (questaoatual > questoes.perguntas.length) {
    document.getElementById("jogo").classList.add("hidden");
    document.getElementById("nome-final").textContent = nome;
    document.getElementById("ponto-final").textContent = `${acertos} acerto(s)`;
    document.getElementById("final").classList.remove("hidden");

    var pontuacaoFinal = {
      nome: nome,
      acertos: acertos,
      dificuldade: dificuldade,
    };

    if (localStorage.getItem("ranking")) {
      var listRanking = JSON.parse(localStorage.getItem("ranking"));
      listRanking.push(pontuacaoFinal);
      localStorage.setItem("ranking", JSON.stringify(listRanking));
    } else {
      var listRanking = [pontuacaoFinal];
      localStorage.setItem("ranking", JSON.stringify(listRanking));
    }
  } else {
    document.getElementById("jogador-vez").textContent = nome;
    var pergunta = questoes.perguntas[questaoatual - 1];
    document.getElementById("enunciado").textContent = pergunta.enunciado;
    document.getElementById("alternativas").innerHTML = "";
    pergunta.alternativas.forEach((alternativa) => {
      var div = document.createElement("div");
      div.className = "alternativa";
      div.id = alternativa.letra;
      div.onclick = () => {
        SelecionarAlternativa(alternativa);
      };
      div.innerHTML = `<div class="circulo">
                                ${alternativa.letra}
                            </div>
                            <div class="texto">
                                ${alternativa.texto}
                            </div>
                        </div>`;
      document.getElementById("alternativas").appendChild(div);
      DefinirTempo();
      document.getElementById(
        "indice"
      ).textContent = `${questaoatual}/${questoes.perguntas.length}`;
    });
    questaoatual++;
  }
}

function DefinirTempo() {
  var tempototal = 60;
  if (tempoIntervalo) {
    clearInterval(tempoIntervalo);
  }
  tempoIntervalo = setInterval(() => {
    tempototal--;
    if (tempototal < 60 && tempototal > 0)
      document.getElementById("tempo").textContent = `00:${
        tempototal < 10 ? `0${tempototal}` : tempototal
      }`;
    else {
      SelecionarAlternativa(
        questoes.perguntas[questaoatual - 2].alternativas.find(
          (x) => x.correta
        ),
        true
      );
    }
  }, 1000);
}

function SelecionarAlternativa(alternativa, naorespondeu = false) {
  document.getElementById("alternativas").classList.add("bloquear");
  clearInterval(tempoIntervalo);
  if (!bloquear) {
    bloquear = true;
    if (naorespondeu) {
      document.getElementById(alternativa.letra).classList.add("naorespondeu");
    } else if (alternativa.correta) {
      acertos++;
      document.getElementById(alternativa.letra).classList.add("correta");
    } else {
      document.getElementById(alternativa.letra).classList.add("errada");
    }
    setTimeout(() => {
      document.getElementById("alternativas").classList.remove("bloquear");
      bloquear = false;
      ProximaQuestao();
    }, 2000);
  }
}
