document.getElementById("loginForm").addEventListener("submit", function (event) {
    event.preventDefault(); // Evita que a página recarregue

    // Captura os dados do formulário
    const email = document.getElementById("email").value;
    const senha = document.getElementById("password").value;

    // Recupera a lista de usuários cadastrados no localStorage
    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    // Procura um usuário com o email e senha fornecidos
    const usuarioValido = usuarios.find(user => user.email === email && user.senha === senha);

    if (usuarioValido) {
        alert("Login bem-sucedido!");
        window.location.href = "/views/formulario.html"; // Redireciona para o painel do usuário
    } else {
        alert("Usuário ou senha incorretos!");
    }
});
