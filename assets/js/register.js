async function registerUser() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
  
    try {
      const response = await fetch('https://ponto-control-api-tc82.vercel.app/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
  
      if (response.ok) {
        const result = await response.json();
        console.log('Usuário registrado com sucesso:', result.user);
        console.log('Token de autenticação:', result.token);
      } else {
        const error = await response.json();
        console.error('Erro ao registrar usuário:', error.message);
      }
    } catch (error) {
      console.error('Erro ao comunicar com o servidor:', error.message);
    }
  }
  