const fetch = require('node-fetch');

const url = 'http://localhost:3000/api/products';

const products = [
  {
    name: 'Pollo Crispy Combo',
    description: 'Crujiente pollo crispy con papas y salsa especial',
    price: 8.5,
    category: 'Pollo Crispy',
    imageUrl: 'https://via.placeholder.com/300x200.png?text=Pollo+Crispy',
    available: true
  },
  {
    name: 'Alitas BBQ 6pz',
    description: 'Alitas bañadas en salsa BBQ, acompañadas de dip',
    price: 7.0,
    category: 'Alitas',
    imageUrl: 'https://via.placeholder.com/300x200.png?text=Alitas+BBQ',
    available: true
  },
  {
    name: 'Salchipapa Tradicional',
    description: 'Salchicha con papas fritas, salsa de la casa',
    price: 5.5,
    category: 'Salchipapa',
    imageUrl: 'https://via.placeholder.com/300x200.png?text=Salchipapa',
    available: true
  },
  {
    name: 'Wrap de Pollo',
    description: 'Wrap relleno de pollo, lechuga, tomate y salsa cremosa',
    price: 6.0,
    category: 'Wraps',
    imageUrl: 'https://via.placeholder.com/300x200.png?text=Wrap+de+Pollo',
    available: true
  },
  {
    name: 'Bebida Refrescante 500ml',
    description: 'Gaseosa o refresco en botella de 500ml',
    price: 1.5,
    category: 'Bebidas',
    imageUrl: 'https://via.placeholder.com/300x200.png?text=Bebidas',
    available: true
  }
];

async function run() {
  for (const p of products) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(p),
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      console.log('Status:', res.status, '| Category:', p.category, '| ID:', data && data._id ? data._id : data && data.id ? data.id : '(no id)');
      console.log(JSON.stringify(data, null, 2));
    } catch (err) {
      console.error('Error creating product for category', p.category, err);
    }
  }
}

run();
