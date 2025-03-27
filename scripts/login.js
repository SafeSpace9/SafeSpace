document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();  // Impede o envio do formulário
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    const validEmail = 'admin@gmail.com';
    const validPassword = '123';  
    
    
    if (email === validEmail && password === validPassword) {
        alert('Login bem-sucedido!');
       
        window.location.href = './formulario.html';  
    } else {
        alert('Email ou senha inválidos');
    }
});
