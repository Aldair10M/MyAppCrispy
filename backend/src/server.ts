import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import userRoutes from './routes/user.routes';

const app = express();
const PORT = 3000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Rutas
app.use('/api/users', userRoutes);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
