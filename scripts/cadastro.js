document.getElementById("loginForm").addEventListener("submit", function (event) {
    event.preventDefault(); // Evita o recarregamento da página

    // Captura os dados do formulário
    const nome = document.getElementById("nome").value;
    const rm = document.getElementById("rm").value;
    const email = document.getElementById("email").value;
    const senha = document.getElementById("password").value;

    // Criando um objeto para o usuário
    const usuario = {
        nome,
        rm,
        email,
        senha
    };

    // Verifica se já existem usuários cadastrados no localStorage
    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    // Adiciona o novo usuário
    usuarios.push(usuario);

    // Salva a lista atualizada no localStorage
    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    alert("Cadastro realizado com sucesso!");

    // Redireciona para a página de login
    window.location.href = "/views/Login.html";
});
                            