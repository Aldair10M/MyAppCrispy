const fetch = require('node-fetch');

async function run() {
  const url = 'http://localhost:3000/api/products';
  const product = {
    name: 'Classic Burger',
    description: 'Delicious beef burger with lettuce, tomato and cheese',
    price: 6.5,
    category: 'Burgers',
    imageUrl: 'https://via.placeholder.com/300x200.png?text=Classic+Burger',
    available: true
  };

  try {
    const res = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(product),
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    console.log('Response status:', res.status);
    console.log(JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error creating product:', err);
  }
}

run();
