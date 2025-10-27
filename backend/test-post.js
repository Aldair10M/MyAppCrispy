const body = {
  username: 'test',
  birthdate: '1990-01-01',
  address: 'x',
  phone: '123',
  email: 'a@b.com',
  password: '123456',
  confirmPassword: '123456'
};

fetch('http://localhost:3000/api/users/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
})
  .then(async (res) => {
    console.log('status', res.status);
    const text = await res.text();
    console.log('body:', text);
    if (!res.ok) process.exit(1);
  })
  .catch((err) => {
    console.error('fetch error:', err);
    process.exit(2);
  });
