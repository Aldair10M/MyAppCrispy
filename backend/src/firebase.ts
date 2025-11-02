import admin from 'firebase-admin';
// Import service account JSON using require to avoid needing resolveJsonModule
const serviceAccount = require('./config/firebase-adminsdk.json'); // JSON como módulo

// Inicializar Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount)
});

// Exportar la instancia de Firestore
export const db = admin.firestore();
