// Declaração de variáveis

let indice = 0
let imagens = [
    "img/logo3(3).png",
    "img/logo3(4).png",
    "img/logo3(5).png"
]

// Função para trocar a imagem
function trocar() {
    let img = document.getElementById("img")
    img.src = imagens[indice]
}

// Lógica para trocar as imagens
setInterval(function() {
    trocar()
    indice++

    if (indice >= imagens.length) {
        indice = 0
    }
}, 5000) // Troca a imagem a cada 5 segundos
