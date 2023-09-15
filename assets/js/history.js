// Defina a URL do back-end como base para as solicitações HTTP
const apiUrl = 'http://localhost:3000'; // Substitua pelo URL real do seu back-end

document.addEventListener('DOMContentLoaded', () => {
  const historyBody = document.getElementById('historyBody');
  const historyButton = document.getElementById('indexButton');



  indexButton.addEventListener('click', () => {
    window.location.href = 'index.html'; // Redirecionar para a página inicial
  });


  // Função para formatar a data
  function formatDate(dateString) {
    const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
    const utcDate = new Date(dateString);
    return utcDate.toLocaleDateString('pt-BR', options);
  }

  // Função para formatar a hora com base no horário de Brasília
  function formatTimeWithTimeZone(timestamp) {
    const formattedTime = moment(timestamp).tz('America/Sao_Paulo').format('HH:mm:ss');
    return formattedTime;
  }

  // Função para formatar as horas no formato HH:mm
  function formatHours(hours) {
    const parsedHours = parseFloat(hours);
    const hoursPart = Math.floor(parsedHours);
    const minutesPart = Math.round((parsedHours - hoursPart) * 60);
    return `${hoursPart.toString().padStart(2, '0')}:${minutesPart.toString().padStart(2, '0')}`;
  }

  // Função para agrupar os registros por data
  function groupRecordsByDate(records) {
    const groupedData = {};
    for (const record of records) {
      const date = new Date(record.timestamp).toLocaleDateString('pt-BR', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
      });
      if (!groupedData[date]) {
        groupedData[date] = [];
      }
      groupedData[date].push(record);
    }
    return groupedData;
  }

  // Função para carregar o histórico de registros
  async function loadHistory() {
    try {
      const response = await fetch(apiUrl + '/api/history');
      if (!response.ok) {
        throw new Error('Erro ao buscar histórico.');
      }
      const data = await response.json();

      historyBody.innerHTML = ''; // Limpar o conteúdo anterior da tabela

      const groupedData = groupRecordsByDate(data);

      for (const date in groupedData) {
        const records = groupedData[date];
        const row = document.createElement('tr');

        const dateCell = document.createElement('td');
        dateCell.textContent = formatDate(records[0].timestamp);
        row.appendChild(dateCell);

        const types = ['Entrada', 'Início do Almoço', 'Fim do Almoço', 'Saída'];
        for (const type of types) {
          const cell = document.createElement('td');
          const record = records.find((record) => record.type === type);

          if (record) {
            cell.textContent = formatTimeWithTimeZone(record.timestamp);
          }

          row.appendChild(cell);
        }

        // Exibir horas trabalhadas e horas extras da API
        const formattedDate = date.split('/').reverse().join('-'); // Converta para o formato YYYY-MM-DD
        const responseHours = await fetch(`${apiUrl}/api/total-hours?startDate=${formattedDate}&endDate=${formattedDate}`);
        const responseDataHours = await responseHours.json();

        const overtimeCell = document.createElement('td');
        overtimeCell.textContent = formatHours(responseDataHours.totalOvertime);
        row.appendChild(overtimeCell);

        const workedHoursCell = document.createElement('td');
        workedHoursCell.textContent = formatHours(responseDataHours.totalWorkedHours);
        row.appendChild(workedHoursCell);

        const deleteCell = document.createElement('td');
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Excluir Registro';
        deleteButton.addEventListener('click', () => deleteRecord(records[0]._id)); // Use o ID do primeiro registro
        deleteCell.appendChild(deleteButton);
        row.appendChild(deleteCell);

        historyBody.appendChild(row);
      }
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
    }
  }

    // Função para excluir um registro
    async function deleteRecord(recordId) {
      try {
        const response = await fetch(`${apiUrl}/api/delete-action/${recordId}`, {
          method: 'DELETE',
        });
    
        if (response.ok) {
          console.log('Registro excluído com sucesso.');
          loadHistory();
        } else {
          console.error('Erro ao excluir registro.');
        }
      } catch (error) {
        console.error('Erro ao excluir registro:', error);
      }
    }


  // Carregar o histórico quando a página carregar
  loadHistory();

});
