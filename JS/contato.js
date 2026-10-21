
function cadastrar(ev) {
    // Não envia o formulário
    ev.preventDefault();

    const formulario = document.getElementById("form-pedido");

    // Verifica se os campos obrigatórios foram preenchidos
    if (!formulario.checkValidity()) {
        formulario.reportValidity();
        return;
    }

    const nome = document.getElementById("nome").value;
    const produto = document.getElementById("produto").value;
    const quantidade = Number(document.getElementById("quantidade").value);
    const total = document.getElementById("total").value;
    const pagamento = document.getElementById("pagamento").value;
    const entrega = document.getElementById("entrega").value;

    // Se escolher Pix, mostra o QR Code somente ao finalizar
    if (pagamento === "Pix") {
        mostrarPix();

        document.getElementById("area-pix").style.display = "block";

        document.getElementById("area-pix").scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

        return;
    }

    // Para outras formas de pagamento
    document.getElementById("area-pix").style.display = "none";

    alert(
        "Pedido preenchido com sucesso!\n\n" +
        "Cliente: " + nome + "\n" +
        "Produto: " + produto + "\n" +
        "Quantidade: " + quantidade + "\n" +
        "Total: " + total + "\n" +
        "Pagamento: " + pagamento + "\n" +
        "Entrega: " + entrega
    );
}


// BUSCAR ENDEREÇO PELO CEP

function buscar(ev) {
    if (ev.key === "Enter") {
        ev.preventDefault();

        const cep = document.getElementById("cep").value
            .replace(/\D/g, "");

        if (cep.length !== 8) {
            alert("Digite um CEP válido com 8 números.");
            return;
        }

        const logradouro = document.getElementById("endereco");
        const bairro = document.getElementById("bairro");
        const cidade = document.getElementById("cidade");

        const url = `https://viacep.com.br/ws/${cep}/json/`;

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Erro ao consultar o CEP");
                }

                return response.json();
            })
            .then(dados => {
                if (dados.erro) {
                    alert("CEP não encontrado.");
                    return;
                }

                logradouro.value = dados.logradouro || "";
                bairro.value = dados.bairro || "";
                cidade.value = dados.localidade || "";
            })
            .catch(erro => {
                alert("Não foi possível buscar o CEP. Tente novamente.");
                console.error(erro);
            });
    }
}


// CALCULAR PREÇO E TOTAL

function calcularTotal() {
    const produto = document.getElementById("produto");
    const quantidade = document.getElementById("quantidade");
    const preco = document.getElementById("preco");
    const total = document.getElementById("total");

    const opcao = produto.options[produto.selectedIndex];

    const valorUnitario = Number(opcao.dataset.preco) || 0;
    const qtd = Math.max(1, Number(quantidade.value) || 1);

    preco.value = valorUnitario.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    total.value = (valorUnitario * qtd).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}


// GERAR QR CODE PIX FICTÍCIO

function mostrarPix() {
    const pagamento = document.getElementById("pagamento");
    const areaPix = document.getElementById("area-pix");
    const produto = document.getElementById("produto");
    const quantidade = document.getElementById("quantidade");
    const valorPix = document.getElementById("valor-pix");
    const qrcode = document.getElementById("qrcode");

    // Não mostra o QR Code antes de finalizar o pedido
    areaPix.style.display = "none";

    if (pagamento.value !== "Pix") {
        return;
    }

    const opcao = produto.options[produto.selectedIndex];
    const preco = Number(opcao.dataset.preco) || 0;
    const qtd = Math.max(1, Number(quantidade.value) || 1);
    const total = preco * qtd;

    valorPix.textContent = "Valor do pedido: " +
        total.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });

    qrcode.innerHTML = "";

    if (typeof QRCode === "undefined") {
        alert("Não foi possível carregar o QR Code. Verifique sua conexão.");
        return;
    }

    new QRCode(qrcode, {
        text: "PIX-DEMONSTRACAO-NAO-REAL-" + total.toFixed(2),
        width: 200,
        height: 200
    });

    areaPix.style.display = "block";
}


// CONFIGURAÇÕES INICIAIS

document.addEventListener("DOMContentLoaded", function () {
    const produto = document.getElementById("produto");
    const quantidade = document.getElementById("quantidade");
    const pagamento = document.getElementById("pagamento");
    const formulario = document.getElementById("form-pedido");
    const areaPix = document.getElementById("area-pix");
    const cep = document.getElementById("cep");

    // Começa com o QR Code escondido
    areaPix.style.display = "none";

    // Atualiza o preço e o total
    produto.addEventListener("change", calcularTotal);
    quantidade.addEventListener("input", calcularTotal);

    // Esconde o QR Code se o cliente mudar a forma de pagamento
    pagamento.addEventListener("change", function () {
        areaPix.style.display = "none";
    });

    // Finaliza o pedido
    formulario.addEventListener("submit", cadastrar);

    // Busca o endereço pelo CEP
    cep.addEventListener("keydown", buscar);

    // Atualiza os valores após limpar o formulário
    formulario.addEventListener("reset", function () {
        areaPix.style.display = "none";

        setTimeout(function () {
            calcularTotal();
        }, 0);
    });

    calcularTotal();
});
