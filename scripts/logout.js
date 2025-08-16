// Função para logout de estudante
function logoutStudent() {
    localStorage.removeItem('student_authenticated');
    localStorage.removeItem('student_email');
    localStorage.removeItem('student_name');
    window.location.href = '/views/Login.html';
}

// Função para logout de admin
function logoutAdmin() {
    localStorage.removeItem('admin_authenticated');
    localStorage.removeItem('admin_username');
    window.location.href = '/views/admin-login.html';
}

// Função para logout geral (remove todas as autenticações)
function logoutAll() {
    localStorage.removeItem('student_authenticated');
    localStorage.removeItem('student_email');
    localStorage.removeItem('student_name');
    localStorage.removeItem('admin_authenticated');
    localStorage.removeItem('admin_username');
    window.location.href = '/';
}

// Verifica se há algum usuário logado e adiciona botão de logout se necessário
document.addEventListener('DOMContentLoaded', () => {
    const isStudentLoggedIn = localStorage.getItem('student_authenticated') === 'true';
    const isAdminLoggedIn = localStorage.getItem('admin_authenticated') === 'true';
    
    if (isStudentLoggedIn || isAdminLoggedIn) {
        // Adiciona botão de logout se não existir
        if (!document.getElementById('logoutBtn')) {
            const logoutBtn = document.createElement('button');
            logoutBtn.id = 'logoutBtn';
            logoutBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i> Sair';
            logoutBtn.className = 'logout-button';
            logoutBtn.onclick = () => {
                if (isStudentLoggedIn) {
                    logoutStudent();
                } else if (isAdminLoggedIn) {
                    logoutAdmin();
                }
            };
            
            // Adiciona o botão ao header se existir
            const header = document.querySelector('header nav');
            if (header) {
                header.appendChild(logoutBtn);
            }
        }
    }
});
