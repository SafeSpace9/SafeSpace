document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById("loginForm");
    const errorMessage = document.getElementById("errorMessage");
    const togglePassword = document.querySelector('.toggle-password');
    const passwordInput = document.getElementById("password");

    // Toggle password visibility
    if (togglePassword) {
        togglePassword.addEventListener('click', () => {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            togglePassword.classList.toggle('fa-eye');
            togglePassword.classList.toggle('fa-eye-slash');
        });
    }

    // Handle form submission
    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const email = document.getElementById("email").value.trim();
        const senha = document.getElementById("password").value.trim();

        // Validação simples
        if (!email || !senha) {
            showError('Por favor, preencha todos os campos.');
            return;
        }

        // Validação de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showError('Por favor, insira um email válido.');
            return;
        }

        try {
            // Busca usuários no localStorage
            let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
            const usuarioValido = usuarios.find(user => user.email === email && user.senha === senha);

            if (usuarioValido) {
                // Login bem-sucedido
                localStorage.setItem('student_authenticated', 'true');
                localStorage.setItem('student_email', email);
                localStorage.setItem('student_name', usuarioValido.nome);
                
                showSuccess('Login realizado com sucesso!');
                
                // Redireciona para o formulário após um breve delay
                setTimeout(() => {
                    window.location.href = "/views/formulario.html";
                }, 1000);
            } else {
                throw new Error('Credenciais inválidas');
            }
        } catch (error) {
            showError('Email ou senha incorretos.');
            loginForm.reset();
            // Garante que não há autenticação em caso de erro
            localStorage.removeItem('student_authenticated');
            localStorage.removeItem('student_email');
            localStorage.removeItem('student_name');
        }
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

    // Se já estiver autenticado, redireciona para o formulário
    if (localStorage.getItem('student_authenticated') === 'true') {
        window.location.href = "/views/formulario.html";
    }
});
                    