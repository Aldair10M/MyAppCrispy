(async ()=>{
  try {
    const res = await fetch('http://localhost:3000/api/users/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'edualdairpenagarcia92@gmail.com', code: '539985' })
    });
    console.log('status', res.status);
    const text = await res.text();
    console.log('body:', text);
  } catch (e) {
    console.error('error', e);
  }
})();
