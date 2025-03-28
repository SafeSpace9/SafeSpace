document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');
    const togglePassword = document.querySelector('.toggle-password');
    const passwordInput = document.getElementById('password');

    // Limpa qualquer autenticação anterior
    localStorage.removeItem('admin_authenticated');
    localStorage.removeItem('admin_username');

    // Credenciais mockadas para teste
    const MOCK_CREDENTIALS = {
        username: 'admin',
        password: 'admin123'
    };

    // Toggle password visibility
    togglePassword.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        togglePassword.classList.toggle('fa-eye');
        togglePassword.classList.toggle('fa-eye-slash');
    });

    // Handle form submission
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();

        // Validação simples
        if (!username || !password) {
            showError('Por favor, preencha todos os campos.');
            return;
        }

        try {
            // Simulação de chamada à API
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simula delay da rede

            // Verificação das credenciais
            if (username === MOCK_CREDENTIALS.username && password === MOCK_CREDENTIALS.password) {
                // Login bem-sucedido
                localStorage.setItem('admin_authenticated', 'true');
                localStorage.setItem('admin_username', username);
                showSuccess('Login realizado com sucesso!');

                // Redireciona para o dashboard após um breve delay
                setTimeout(() => {
                    window.location.href = '/views/dashboard.html';
                }, 1000);
            } else {
                throw new Error('Credenciais inválidas');
            }
        } catch (error) {
            showError('Usuário ou senha incorretos.');
            loginForm.reset();
            // Garante que não há autenticação em caso de erro
            localStorage.removeItem('admin_authenticated');
            localStorage.removeItem('admin_username');
        }
    });

    // Função para mostrar mensagem de erro
    function showError(message) {
        errorMessage.style.color = 'var(--error-color)';
        errorMessage.textContent = message;

        // Limpa a mensagem após 3 segundos
        setTimeout(() => {
            errorMessage.textContent = '';
        }, 3000);
    }

    // Função para mostrar mensagem de sucesso
    function showSuccess(message) {
        errorMessage.style.color = 'var(--success-color)';
        errorMessage.textContent = message;
    }

    // Se já estiver autenticado, redireciona para o dashboard
    if (localStorage.getItem('admin_authenticated')) {
        window.location.href = '/views/dashboard.html';
    }
}); 