// Verificação de autenticação
function checkStudentAuth() {
    const isAuthenticated = localStorage.getItem('student_authenticated') === 'true';
    if (!isAuthenticated) {
        showNotification('Você precisa estar logado para acessar esta página.', 'error');
        setTimeout(() => {
            window.location.href = '/views/Login.html';
        }, 2000);
        return false;
    }
    return true;
}

// Verificar autenticação imediatamente
if (!checkStudentAuth()) {
    throw new Error('Não autenticado');
}

// Elementos do DOM
const form = document.getElementById('denunciaForm');
const inputFile = document.getElementById('arquivo');
const fileList = document.getElementById('fileList');
const fileUploadArea = document.querySelector('.file-upload-area');
const charCounter = document.getElementById('charCount');
const descricaoTextarea = document.getElementById('descricao');
const submitButton = document.getElementById('button_denuncia');

const DENUNCIAS_KEY = 'denuncias';
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_CHARS = 1000;

// Sistema de notificações
function showNotification(message, type = 'info') {
    // Remove notificação existente
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;

    // Adiciona estilos CSS inline
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        max-width: 400px;
        animation: slideInRight 0.3s ease;
    `;

    document.body.appendChild(notification);

    // Auto-remove após 5 segundos
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Contador de caracteres
function updateCharCounter() {
    const currentLength = descricaoTextarea.value.length;
    charCounter.textContent = currentLength;
    
    if (currentLength > MAX_CHARS * 0.9) {
        charCounter.style.color = currentLength > MAX_CHARS ? '#dc3545' : '#ffc107';
    } else {
        charCounter.style.color = '#6c757d';
    }
}

// Validação em tempo real
function validateField(field, validationRules) {
    const value = field.value.trim();
    const formGroup = field.closest('.form-group');
    
    // Remove classes de erro/sucesso anteriores
    formGroup.classList.remove('error', 'success');
    
    for (const rule of validationRules) {
        if (!rule.test(value)) {
            formGroup.classList.add('error');
            return false;
        }
    }
    
    if (value.length > 0) {
        formGroup.classList.add('success');
    }
    return true;
}

// Configuração de validação
const validationRules = {
    assunto: [
        { test: (value) => value.length >= 3, message: 'Assunto deve ter pelo menos 3 caracteres' },
        { test: (value) => value.length <= 100, message: 'Assunto deve ter no máximo 100 caracteres' }
    ],
    descricao: [
        { test: (value) => value.length >= 10, message: 'Descrição deve ter pelo menos 10 caracteres' },
        { test: (value) => value.length <= MAX_CHARS, message: `Descrição deve ter no máximo ${MAX_CHARS} caracteres` }
    ],
    tipoProblema: [
        { test: (value) => value !== '', message: 'Selecione um tipo de problema' }
    ]
};

// Gerenciamento de arquivos
function updateFileList() {
    const files = inputFile.files;
    fileList.innerHTML = '';

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Validação de tamanho
        if (file.size > MAX_FILE_SIZE) {
            showNotification(`Arquivo "${file.name}" excede o tamanho máximo de 5MB.`, 'error');
            continue;
        }

        const fileItem = document.createElement('li');
        fileItem.innerHTML = `
            <span class="file-name">
                <i class="fas fa-file"></i>
                ${file.name}
                <small>(${(file.size / 1024 / 1024).toFixed(2)} MB)</small>
            </span>
            <button class="remove-btn" onclick="removeFile(${i})">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        fileList.appendChild(fileItem);
    }
}

function removeFile(index) {
    const files = inputFile.files;
    const dataTransfer = new DataTransfer();

    for (let i = 0; i < files.length; i++) {
        if (i !== index) {
            dataTransfer.items.add(files[i]);
        }
    }

    inputFile.files = dataTransfer.files;
    updateFileList();
}

// Drag and Drop
function setupDragAndDrop() {
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        fileUploadArea.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        fileUploadArea.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        fileUploadArea.addEventListener(eventName, unhighlight, false);
    });

    function highlight(e) {
        fileUploadArea.classList.add('dragover');
    }

    function unhighlight(e) {
        fileUploadArea.classList.remove('dragover');
    }

    fileUploadArea.addEventListener('drop', handleDrop, false);

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        inputFile.files = files;
        updateFileList();
    }
}

// Salvar denúncia
function salvarDenuncia(novaDenuncia) {
    const denuncias = JSON.parse(localStorage.getItem(DENUNCIAS_KEY)) || [];
    novaDenuncia.id = Date.now();
    novaDenuncia.timestamp = new Date().toISOString();
    denuncias.unshift(novaDenuncia);
    localStorage.setItem(DENUNCIAS_KEY, JSON.stringify(denuncias));
}

// Loading state
function setLoadingState(loading) {
    if (loading) {
        submitButton.classList.add('loading');
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    } else {
        submitButton.classList.remove('loading');
        submitButton.disabled = false;
        submitButton.innerHTML = '<i class="fas fa-paper-plane"></i> Enviar Denúncia';
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Contador de caracteres
    descricaoTextarea.addEventListener('input', updateCharCounter);
    
    // Validação em tempo real
    document.getElementById('assunto').addEventListener('input', function() {
        validateField(this, validationRules.assunto);
    });
    
    descricaoTextarea.addEventListener('input', function() {
        validateField(this, validationRules.descricao);
    });
    
    document.getElementById('tipoproblema').addEventListener('change', function() {
        validateField(this, validationRules.tipoProblema);
    });
    
    // Upload de arquivos
    inputFile.addEventListener('change', updateFileList);
    setupDragAndDrop();
    
    // Submit do formulário
    form.addEventListener('submit', handleSubmit);
});

async function handleSubmit(event) {
    event.preventDefault();

    // Validação final
    const assunto = document.getElementById('assunto').value.trim();
    const descricao = document.getElementById('descricao').value.trim();
    const tipoProblema = document.getElementById('tipoproblema').value;
    const tipoDenuncia = document.getElementById('tipodenuncia').value;

    if (!assunto) {
        showNotification('Por favor, preencha o campo Assunto.', 'error');
        document.getElementById('assunto').focus();
        return;
    }

    if (!descricao) {
        showNotification('Por favor, preencha o campo Descrição.', 'error');
        descricaoTextarea.focus();
        return;
    }

    if (!tipoProblema) {
        showNotification('Por favor, selecione um tipo de problema.', 'error');
        document.getElementById('tipoproblema').focus();
        return;
    }

    // Estado de loading
    setLoadingState(true);

    try {
        // Simula envio (substitua por sua API real)
        await new Promise(resolve => setTimeout(resolve, 2000));

        const novaDenuncia = {
            tipoDenuncia: tipoDenuncia,
            tipo: tipoProblema,
            assunto: assunto,
            descricao: descricao,
            data: new Date().toISOString().split('T')[0],
            status: 'pendente',
            urgente: ['bullying', 'violencia', 'assedio'].includes(tipoProblema),
            arquivos: Array.from(inputFile.files).map(file => ({
                name: file.name,
                size: file.size,
                type: file.type
            }))
        };

        salvarDenuncia(novaDenuncia);

        showNotification('Denúncia enviada com sucesso! Sua identidade será mantida em sigilo.', 'success');

        // Limpa o formulário
        form.reset();
        fileList.innerHTML = '';
        updateCharCounter();
        
        // Remove classes de validação
        document.querySelectorAll('.form-group').forEach(group => {
            group.classList.remove('error', 'success');
        });

        // Redireciona após 2 segundos
        setTimeout(() => {
            window.location.href = "/index.html";
        }, 2000);

    } catch (error) {
        console.error("Erro ao salvar denúncia:", error);
        showNotification('Erro ao enviar denúncia. Por favor, tente novamente.', 'error');
    } finally {
        setLoadingState(false);
    }
}

// Adiciona estilos CSS para animações
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .notification button {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 0;
        font-size: 1rem;
    }
    
    .notification button:hover {
        opacity: 0.8;
    }
`;
document.head.appendChild(style);