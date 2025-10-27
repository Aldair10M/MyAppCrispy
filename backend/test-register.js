const fetch = require('node-fetch');

const testUser = {
  username: 'testuser',
  birthdate: '1990-01-01',
  address: 'Test Address 123',
  phone: '123456789',
  email: 'test@example.com',
  password: 'password123',
  confirmPassword: 'password123'
};

async function testRegister() {
  try {
    console.log('Intentando registrar usuario:', testUser);
    
    const response = await fetch('http://localhost:3000/api/users/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser)
    });

    console.log('Status:', response.status);
    console.log('Status Text:', response.statusText);
    
    const text = await response.text();
    console.log('Response body:', text);
    
    try {
      const json = JSON.parse(text);
      console.log('Parsed JSON response:', json);
    } catch (e) {
      console.log('Response no es JSON válido');
    }

    if (!response.ok) {
      console.error('Request failed');
      process.exit(1);
    }
    
    console.log('Registro exitoso');
  } catch (err) {
    console.error('Error al hacer la petición:', err);
    process.exit(1);
  }
}

testRegister();