// Defina a URL do back-end como base para as solicitações HTTP
const apiUrl = 'http://localhost:3000'; // Substitua pelo URL real do seu back-end


document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.getElementById('registerForm');
  const historyButton = document.getElementById('historyButton');

  registerForm.addEventListener('submit', registerAction);


// Função para exibir o diálogo de erro
// Defina a função showErrorDialog
function showErrorDialog(message) {
  const errorDialog = document.getElementById('errorDialog');
  const errorText = document.getElementById('errorText');

  errorText.textContent = message;
  errorDialog.style.display = 'block';

  const closeBtn = errorDialog.querySelector('.close-btn');
  closeBtn.addEventListener('click', () => {
    errorDialog.style.display = 'none';
  });

  // Fechar o diálogo se o usuário clicar fora dele
  window.addEventListener('click', (event) => {
    if (event.target === errorDialog) {
      errorDialog.style.display = 'none';
    }
  });
}



  historyButton.addEventListener('click', () => {
    window.location.href = 'history.html'; // Redirecionar para a página de Histórico de Registros
  });

// Função para registrar uma ação
async function registerAction(event) {
  event.preventDefault();

  const actionType = document.getElementById('actionType').value;

  try {
    const response = await fetch('http://localhost:3000/api/history');

    const data = await response.json();

    const currentDate = new Date().toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    });

    const hasExistingEntry = data.some(record => {
      const recordDate = new Date(record.timestamp).toLocaleDateString('pt-BR', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
      });
      return recordDate === currentDate && record.type === actionType;
    });

    if (hasExistingEntry) {
      showErrorDialog('Já existe um registro para esta ação neste dia.');
      return;
    }

    const postResponse = await fetch(apiUrl + '/api/register-action', { // Corrija o caminho da rota para '/register-action'
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ type: actionType }),
    });

    const responseData = await postResponse.json(); // Lê a resposta JSON uma vez

    if (!postResponse.ok) {
      showSuccessDialog('Ação registrada com sucesso.'); // Exibir diálogo de sucesso com a mensagem
      if (responseData.message) {
        showErrorDialog(responseData.message); // Exibir diálogo de erro com a mensagem da API
      } else {
        showErrorDialog('Erro ao registrar ação: Ocorreu um erro.'); // Mensagem padrão de erro
      }
    }
  } catch (error) {
    showErrorDialog('Erro ao registrar ação: Ocorreu um erro.'); // Mensagem padrão de erro
  }
}


  // Event listener para registrar ação
  registerForm.addEventListener('submit', registerAction);

});