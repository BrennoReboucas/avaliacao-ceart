// Função para formatar CPF automaticamente
function formatarCPF(campo) {
    let cpf = campo.value.replace(/\D/g, ''); // Remove tudo que não for número
    if (cpf.length > 11) cpf = cpf.substring(0, 11); // Limita a 11 dígitos

    cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
    cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
    cpf = cpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2');

    campo.value = cpf;
}

// Função para validar CPF
function validarCPF(cpf) {
    cpf = cpf.replace(/\D/g, ''); // Remove caracteres não numéricos

    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
        return false; // CPF inválido se não tiver 11 dígitos ou for uma sequência repetida
    }

    let soma = 0, resto;

    for (let i = 1; i <= 9; i++) soma += parseInt(cpf[i - 1]) * (11 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf[9])) return false;

    soma = 0;
    for (let i = 1; i <= 10; i++) soma += parseInt(cpf[i - 1]) * (12 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf[10])) return false;

    return true;
}

// Função para formatar telefone automaticamente
function formatarTelefone(campo) {
    let telefone = campo.value.replace(/\D/g, ''); // Remove caracteres não numéricos
    if (telefone.length > 11) telefone = telefone.substring(0, 11); // Limita a 11 dígitos

    telefone = telefone.replace(/^(\d{2})(\d)/, '($1) $2');
    telefone = telefone.replace(/(\d{5})(\d{1,4})$/, '$1-$2');

    campo.value = telefone;
}

// Captura o envio do formulário
document.getElementById("feedbackForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const cpfInput = document.getElementById("cpf");
    
    // Criar o JSON com os dados do formulário
    const formData = {
        nome: document.getElementById("nome").value.trim(),
        telefone: document.getElementById("telefone").value.trim(),
        cpf: cpfInput.value.trim(),
        avaliacao: {
            variedadeProdutos: parseInt(document.querySelector('input[name="produtos"]:checked').value),
            atendimento: parseInt(document.querySelector('input[name="atendimento"]:checked').value)
        },
        observacao: document.getElementById("observacao").value.trim()
    };

    // Enviar os dados para a API
    fetch("http://127.0.0.1:5000/enviar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Erro no envio do formulário.");
        }
        return response.json();
    })
    .then(data => {
        console.log("✅ Formulário enviado com sucesso:", data);
        // Redireciona para a página de agradecimento
        window.location.href = "agradecimentos.html";
    })
    .catch(error => {
        console.error("❌ Erro ao enviar formulário:", error);
        alert("Erro ao enviar. Tente novamente.");
    });
});
