const inputFile = document.getElementById('arquivo');
const fileList = document.getElementById('fileList');
const DENUNCIAS_KEY = 'denuncias';

function updateFileList() {
  const files = inputFile.files;
  fileList.innerHTML = '';

  for (let i = 0; i < files.length; i++) {
    const fileItem = document.createElement('li');
    const fileName = document.createElement('span');
    fileName.textContent = files[i].name;
    
    const removeButton = document.createElement('span');
    removeButton.textContent = '×';
    removeButton.classList.add('remove-button');
    
    removeButton.onclick = function () {
      removeFile(i);
    };

    fileItem.appendChild(fileName);
    fileItem.appendChild(removeButton);
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

function salvarDenuncia(novaDenuncia) {
  // Recupera denúncias existentes ou inicializa array vazio
  const denuncias = JSON.parse(localStorage.getItem(DENUNCIAS_KEY)) || [];

  // Gera ID único baseado em timestamp
  novaDenuncia.id = Date.now();

  // Adiciona a nova denúncia ao início do array (para aparecer primeiro na lista)
  denuncias.unshift(novaDenuncia);

  // Salva no localStorage
  localStorage.setItem(DENUNCIAS_KEY, JSON.stringify(denuncias));
}

inputFile.addEventListener('change', updateFileList);

document.getElementById("denunciaForm").addEventListener("submit", function(event) {
  event.preventDefault(); 

  const tipoDenuncia = document.getElementById("tipodenuncia").value;
  const tipoProblema = document.getElementById("tipoproblema").value;
  const assunto = document.getElementById("assunto").value;
  const descricao = document.getElementById("descricao").value;

  // Validação dos campos
  if (!assunto.trim()) {
      alert("Por favor, preencha o campo Assunto.");
      return; 
  }

  if (!descricao.trim()) {
      alert("Por favor, preencha o campo Descrição.");
      return; 
  }

  // Cria objeto com os dados da denúncia
  const novaDenuncia = {
    tipo: tipoProblema,
    assunto: assunto,
    descricao: descricao,
    data: new Date().toISOString().split('T')[0],
    status: 'pendente',
    urgente: tipoProblema === 'bullying' || tipoProblema === 'violencia' || tipoProblema === 'assedio'
  };

  try {
    // Salva a denúncia
    salvarDenuncia(novaDenuncia);

    // Feedback ao usuário
    alert("Denúncia enviada com sucesso! Sua identidade será mantida em sigilo.");

    // Limpa o formulário
    document.getElementById("denunciaForm").reset();
    fileList.innerHTML = '';

    // Redireciona para a página inicial
    window.location.href = "/index.html";
  } catch (error) {
    console.error("Erro ao salvar denúncia:", error);
    alert("Erro ao enviar denúncia. Por favor, tente novamente.");
  }
});