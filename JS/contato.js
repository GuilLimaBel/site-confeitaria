function cadastrar(ev) {
    // Não envia o formulário
    ev.preventDefault();

    const nome = document.getElementById("nome").value;
    const produto = document.getElementById("produto").value;
    const quantidade = Number(document.getElementById("quantidade").value);
    const total = document.getElementById("total").value;
    const pagamento = document.getElementById("pagamento").value;
    const entrega = document.getElementById("entrega").value;

    if (!produto || !pagamento || !entrega) {
        alert("Preencha todos os campos do pedido!");
        return;
    }

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


// ATUALIZAR O TOTAL QUANDO ALTERAR O PEDIDO

document.addEventListener("DOMContentLoaded", function () {
    const produto = document.getElementById("produto");
    const quantidade = document.getElementById("quantidade");
    const formulario = document.getElementById("form-pedido");

    produto.addEventListener("change", calcularTotal);
    quantidade.addEventListener("input", calcularTotal);

    formulario.addEventListener("submit", cadastrar);

    formulario.addEventListener("reset", function () {
        setTimeout(calcularTotal, 0);
    });

    calcularTotal();
});
