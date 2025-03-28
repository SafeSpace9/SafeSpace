// Verificação de autenticação
if (!localStorage.getItem('admin_authenticated')) {
    window.location.href = '/views/admin-login.html';
}

// Constantes
const DENUNCIAS_KEY = 'denuncias';

// Dados iniciais de exemplo
const dadosIniciais = [
    {
        id: 1,
        tipo: 'Bullying',
        assunto: 'Intimidação no intervalo',
        descricao: 'Um grupo de alunos está intimidando outros durante o intervalo próximo à quadra.',
        data: '2024-03-27',
        status: 'pendente',
        urgente: true
    },
    {
        id: 2,
        tipo: 'Discriminação',
        assunto: 'Preconceito em sala de aula',
        descricao: 'Aluno sendo discriminado por sua origem.',
        data: '2024-03-26',
        status: 'resolvido',
        urgente: false
    },
    {
        id: 3,
        tipo: 'Feedback',
        assunto: 'Sugestão para biblioteca',
        descricao: 'Sugestão para ampliar o horário de funcionamento da biblioteca.',
        data: '2024-03-25',
        status: 'pendente',
        urgente: false
    }
];

// Inicializa o banco de dados local se não existir
if (!localStorage.getItem(DENUNCIAS_KEY)) {
    localStorage.setItem(DENUNCIAS_KEY, JSON.stringify(dadosIniciais));
}

// Funções de manipulação de dados
function getDenuncias() {
    try {
        const dados = localStorage.getItem(DENUNCIAS_KEY);
        console.log('Dados brutos do localStorage:', dados);
        return dados ? JSON.parse(dados) : [];
    } catch (e) {
        console.error('Erro ao carregar denúncias:', e);
        return [];
    }
}

function salvarDenuncias(denuncias) {
    localStorage.setItem(DENUNCIAS_KEY, JSON.stringify(denuncias));
}

function atualizarStatus(id, novoStatus) {
    const denuncias = getDenuncias();
    const index = denuncias.findIndex(d => d.id === id);
    if (index !== -1) {
        denuncias[index].status = novoStatus;
        salvarDenuncias(denuncias);
        atualizarInterface();
    }
}

// Funções de UI
function atualizarInterface() {
    atualizarContadores();
    atualizarTabela();
    atualizarGraficos();
    atualizarNotificacoes();
}

function atualizarContadores() {
    const denuncias = getDenuncias();

    // Atualiza os números nos cards
    const cards = document.querySelectorAll('.card .number');
    if (cards.length >= 4) {
        // Total de denúncias
        cards[0].textContent = denuncias.length;

        // Denúncias pendentes
        const pendentes = denuncias.filter(d => d.status === 'pendente').length;
        cards[1].textContent = pendentes;

        // Denúncias resolvidas
        const resolvidas = denuncias.filter(d => d.status === 'resolvido').length;
        cards[2].textContent = resolvidas;

        // Feedbacks
        const feedbacks = denuncias.filter(d => d.tipo.toLowerCase() === 'feedback').length;
        cards[3].textContent = feedbacks;
    }

    // Atualiza o badge de notificações
    const badge = document.querySelector('.badge');
    if (badge) {
        const urgentes = denuncias.filter(d => d.urgente && d.status !== 'resolvido').length;
        const pendentes = denuncias.filter(d => d.status === 'pendente').length;
        badge.textContent = urgentes + pendentes;
    }
}

function criarLinhaTabela(denuncia) {
    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td>#${denuncia.id}</td>
        <td>${denuncia.tipo}</td>
        <td>${denuncia.assunto}</td>
        <td>${formatarData(denuncia.data)}</td>
        <td>
            <span class="status-tag status-${denuncia.status}">
                ${denuncia.status.charAt(0).toUpperCase() + denuncia.status.slice(1)}
                ${denuncia.urgente ? ' <i class="fas fa-exclamation-triangle" style="color: #e74c3c"></i>' : ''}
            </span>
        </td>
        <td>
            <button onclick="abrirModal(${denuncia.id})" class="btn-ver">
                <i class="fas fa-eye"></i>
            </button>
        </td>
    `;
    return tr;
}

function atualizarTabela() {
    const tbody = document.getElementById('denunciasTableBody');
    if (!tbody) {
        console.error('Elemento denunciasTableBody não encontrado');
        return;
    }

    const denuncias = getDenuncias();
    console.log('Denúncias para exibir na tabela:', denuncias);
    tbody.innerHTML = '';

    // Aplica filtros se existirem os elementos
    let denunciasFiltradas = [...denuncias];

    const statusFiltro = document.getElementById('filterStatus');
    const tipoFiltro = document.getElementById('filterTipo');

    if (statusFiltro && statusFiltro.value !== 'todos') {
        denunciasFiltradas = denunciasFiltradas.filter(d => d.status === statusFiltro.value);
    }

    if (tipoFiltro && tipoFiltro.value !== 'todos') {
        denunciasFiltradas = denunciasFiltradas.filter(d => d.tipo.toLowerCase() === tipoFiltro.value);
    }

    console.log('Denúncias filtradas:', denunciasFiltradas);

    denunciasFiltradas.forEach(denuncia => {
        tbody.appendChild(criarLinhaTabela(denuncia));
    });
}

function atualizarGraficos() {
    const denuncias = getDenuncias();

    // Destrói gráficos existentes
    const chartTipos = Chart.getChart('denunciasChart');
    if (chartTipos) chartTipos.destroy();
    const chartStatus = Chart.getChart('statusChart');
    if (chartStatus) chartStatus.destroy();

    // Gráfico de Tipos
    new Chart(document.getElementById('denunciasChart'), {
        type: 'doughnut',
        data: {
            labels: ['Bullying', 'Discriminação', 'Assédio', 'Violência', 'Feedback', 'Outros'],
            datasets: [{
                data: contarTipos(denuncias),
                backgroundColor: [
                    '#3A7854',
                    '#e74c3c',
                    '#f1c40f',
                    '#9b59b6',
                    '#3498db',
                    '#95a5a6'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });

    // Gráfico de Status
    new Chart(document.getElementById('statusChart'), {
        type: 'bar',
        data: {
            labels: ['Pendente', 'Em Análise', 'Resolvido'],
            datasets: [{
                label: 'Quantidade',
                data: contarStatus(denuncias),
                backgroundColor: '#3A7854'
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
}

function atualizarNotificacoes() {
    const denuncias = getDenuncias();
    const urgentes = denuncias.filter(d => d.urgente && d.status !== 'resolvido').length;
    const pendentes = denuncias.filter(d => d.status === 'pendente').length;

    const badge = document.getElementById('notificationCount');
    badge.textContent = urgentes + pendentes;

    if (urgentes + pendentes > 0) {
        badge.style.display = 'block';
    } else {
        badge.style.display = 'none';
    }
}

// Funções auxiliares
function formatarData(data) {
    return new Date(data).toLocaleDateString('pt-BR');
}

function contarTipos(denuncias) {
    const tipos = {
        'bullying': 0,
        'discriminacao': 0,
        'assedio': 0,
        'violencia': 0,
        'feedback': 0,
        'outros': 0
    };

    denuncias.forEach(d => {
        const tipo = d.tipo.toLowerCase();
        if (tipos.hasOwnProperty(tipo)) {
            tipos[tipo]++;
        } else {
            tipos['outros']++;
        }
    });

    return Object.values(tipos);
}

function contarStatus(denuncias) {
    const status = {
        'pendente': 0,
        'em_analise': 0,
        'resolvido': 0
    };

    denuncias.forEach(d => {
        if (status.hasOwnProperty(d.status)) {
            status[d.status]++;
        }
    });

    return Object.values(status);
}

// Modal
function abrirModal(id) {
    const denuncia = getDenuncias().find(d => d.id === id);
    if (!denuncia) return;

    const modal = document.getElementById('denunciaModal');
    const detalhes = document.getElementById('denunciaDetails');

    detalhes.innerHTML = `
        <h3>Denúncia #${denuncia.id}</h3>
        <p><strong>Tipo:</strong> ${denuncia.tipo}</p>
        <p><strong>Assunto:</strong> ${denuncia.assunto}</p>
        <p><strong>Descrição:</strong> ${denuncia.descricao}</p>
        <p><strong>Data:</strong> ${formatarData(denuncia.data)}</p>
        <p><strong>Status:</strong> 
            <span class="status-tag status-${denuncia.status}">
                ${denuncia.status.charAt(0).toUpperCase() + denuncia.status.slice(1)}
            </span>
        </p>
        ${denuncia.urgente ? '<p class="urgente"><strong><i class="fas fa-exclamation-triangle"></i> URGENTE</strong></p>' : ''}
    `;

    modal.style.display = 'block';
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    console.log('Página carregada, inicializando dashboard...');

    // Verifica se há dados no localStorage
    const dados = localStorage.getItem(DENUNCIAS_KEY);
    console.log('Dados no localStorage:', dados);

    if (!dados) {
        console.log('Inicializando dados de exemplo...', dadosIniciais);
        localStorage.setItem(DENUNCIAS_KEY, JSON.stringify(dadosIniciais));
    }

    // Inicializa a interface
    atualizarInterface();

    // Fechar modal
    const modal = document.getElementById('denunciaModal');
    const closeBtn = document.querySelector('.close');

    closeBtn.onclick = () => modal.style.display = 'none';

    window.onclick = (event) => {
        if (event.target === modal) modal.style.display = 'none';
    };

    // Botões de ação no modal
    document.querySelector('.btn-analisar').onclick = () => {
        const id = parseInt(document.querySelector('#denunciaDetails h3').textContent.split('#')[1]);
        atualizarStatus(id, 'em_analise');
        modal.style.display = 'none';
    };

    document.querySelector('.btn-resolver').onclick = () => {
        const id = parseInt(document.querySelector('#denunciaDetails h3').textContent.split('#')[1]);
        atualizarStatus(id, 'resolvido');
        modal.style.display = 'none';
    };

    document.querySelector('.btn-arquivar').onclick = () => {
        const id = parseInt(document.querySelector('#denunciaDetails h3').textContent.split('#')[1]);
        const denuncias = getDenuncias().filter(d => d.id !== id);
        salvarDenuncias(denuncias);
        atualizarInterface();
        modal.style.display = 'none';
    };

    // Pesquisa
    const searchInput = document.querySelector('.search-bar input');
    searchInput.addEventListener('input', (e) => {
        const termo = e.target.value.toLowerCase();
        const denuncias = getDenuncias();
        const denunciasFiltradas = denuncias.filter(d =>
            d.tipo.toLowerCase().includes(termo) ||
            d.assunto.toLowerCase().includes(termo) ||
            d.descricao.toLowerCase().includes(termo)
        );

        const tbody = document.getElementById('denunciasTableBody');
        tbody.innerHTML = '';
        denunciasFiltradas.forEach(denuncia => {
            tbody.appendChild(criarLinhaTabela(denuncia));
        });
    });

    // Filtros
    document.getElementById('filterStatus').addEventListener('change', atualizarTabela);
    document.getElementById('filterTipo').addEventListener('change', atualizarTabela);

    // Logout
    document.getElementById('logout').addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('admin_authenticated');
        window.location.href = '/views/admin-login.html';
    });
});