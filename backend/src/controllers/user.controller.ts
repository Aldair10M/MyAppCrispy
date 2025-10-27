import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';

const userService = new UserService();

export const registerUser = async (req: Request, res: Response) => {
  console.log('registerUser - Inicio del proceso');
  console.log('registerUser - Body recibido:', { ...req.body, password: '[HIDDEN]', confirmPassword: '[HIDDEN]' });

  try {
    // Validación de campos requeridos
    const requiredFields = ['username', 'birthdate', 'address', 'phone', 'email', 'password'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      console.log('registerUser - Campos faltantes:', missingFields);
      return res.status(400).json({ 
        error: 'Campos requeridos faltantes', 
        missingFields 
      });
    }

    const { username, birthdate, address, phone, email, password, confirmPassword, codigo } = req.body;

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('registerUser - Formato de email inválido');
      return res.status(400).json({ error: 'Formato de email inválido' });
    }

    // Validar que las contraseñas coincidan
    if (password !== confirmPassword) {
      console.log('registerUser - Las contraseñas no coinciden');
      return res.status(400).json({ error: 'Las contraseñas no coinciden' });
    }

    console.log('registerUser - Creando instancia de User');
    const newUser = new User(username, birthdate, address, phone, email, password, confirmPassword, codigo);

    console.log('registerUser - Llamando a userService.createUser');
    const createdUser = await userService.createUser(newUser);
    
    console.log('registerUser - Usuario creado exitosamente');
    res.status(201).json({ 
      message: 'Usuario registrado exitosamente', 
      user: { ...createdUser, password: undefined } 
    });
  } catch (error: any) {
    console.error('registerUser - Error durante el proceso:', error);
    const statusCode = error.code === 'auth/email-already-exists' ? 409 : 500;
    res.status(statusCode).json({ 
      error: error.message || 'Error interno del servidor',
      code: error.code
    });
  }
};
