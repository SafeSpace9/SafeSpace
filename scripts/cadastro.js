document.addEventListener('DOMContentLoaded', () => {
    const cadastroForm = document.getElementById("loginForm");
    const errorMessage = document.getElementById("errorMessage");

    cadastroForm.addEventListener("submit", function (event) {
        event.preventDefault();

        // Captura os dados do formulário
        const nome = document.getElementById("nome").value.trim();
        const rm = document.getElementById("rm").value.trim();
        const email = document.getElementById("email").value.trim();
        const senha = document.getElementById("password").value.trim();

        // Validações
        if (!nome || !rm || !email || !senha) {
            showError('Por favor, preencha todos os campos.');
            return;
        }

        // Validação de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showError('Por favor, insira um email válido.');
            return;
        }

        // Validação de senha (mínimo 6 caracteres)
        if (senha.length < 6) {
            showError('A senha deve ter pelo menos 6 caracteres.');
            return;
        }

        // Verifica se o email já está cadastrado
        let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
        const emailExistente = usuarios.find(user => user.email === email);
        
        if (emailExistente) {
            showError('Este email já está cadastrado. Use outro email ou faça login.');
            return;
        }

        // Criando um objeto para o usuário
        const usuario = {
            nome,
            rm,
            email,
            senha,
            dataCadastro: new Date().toISOString()
        };

        // Adiciona o novo usuário
        usuarios.push(usuario);

        // Salva a lista atualizada no localStorage
        localStorage.setItem("usuarios", JSON.stringify(usuarios));

        showSuccess('Cadastro realizado com sucesso!');

        // Redireciona para a página de login após 2 segundos
        setTimeout(() => {
            window.location.href = "/views/Login.html";
        }, 2000);
    });

    // Função para mostrar mensagem de erro
    function showError(message) {
        if (errorMessage) {
            errorMessage.style.color = 'var(--error-color, #ff4444)';
            errorMessage.textContent = message;

            // Limpa a mensagem após 3 segundos
            setTimeout(() => {
                errorMessage.textContent = '';
            }, 3000);
        } else {
            alert(message);
        }
    }

    // Função para mostrar mensagem de sucesso
    function showSuccess(message) {
        if (errorMessage) {
            errorMessage.style.color = 'var(--success-color, #4CAF50)';
            errorMessage.textContent = message;
        } else {
            alert(message);
        }
    }
});
                            