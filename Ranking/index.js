Filtrar(1);

function GetRanking(dificuldade) {
  if (localStorage.getItem("ranking")) {
    var listRanking = JSON.parse(localStorage.getItem("ranking"));
    listRanking = listRanking.filter((x) => x.dificuldade == dificuldade);
    listRanking = listRanking.sort((a, b) => b.acertos - a.acertos);
    var containerRanking = document.getElementById("ranking");
    containerRanking.innerHTML='';

    listRanking.forEach((jogador) => {
      var div = document.createElement("div");
      div.className = "jogador";
      div.innerHTML = `<span class="nome">
                            ${jogador.nome}
                         </span>
                         <span class="pontos">
                            ${jogador.acertos} ponto(s)
                         </span>`;

      containerRanking.appendChild(div);
    });
  }
}

function Filtrar(value) {
  var aux = "box-" + value;
  document.getElementById(aux).classList.add("selecionado");
  for (var i = 0; i < document.getElementById("lista").children.length; i++)
    if (document.getElementById("lista").children[i].id != aux) {
      document
        .getElementById("lista")
        .children[i].classList.remove("selecionado");
    }

  GetRanking(value);
}
