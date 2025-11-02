const fetch = require('node-fetch');

async function run() {
  const id = 'HPJbO6JJPTBc0AOHI0tf';
  const url = `http://localhost:3000/api/products/${id}`;
  const body = {
    imageUrl: 'https://www.bembos.com.pe/media/catalog/product/2/1/2146466302.png?optimize=medium&bg-color=255,255,255&fit=bounds&height=700&width=700&canvas=700:700&format=jpeg'
  };

  try {
    const res = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await res.json();
    console.log('Response status:', res.status);
    console.log(JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error updating product:', err);
  }
}

run();
