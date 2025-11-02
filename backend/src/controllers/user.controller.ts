import { db } from '../firebase';
import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';

const userService = new UserService();

export const verifyUserCode = async (req: Request, res: Response) => {
  console.log('verifyUserCode - Body recibido:', req.body);
  const { email, code } = req.body;

  if (!email || !code) {
    return res.status(400).json({ error: 'Email y código son requeridos' });
  }

  const userService = new UserService();
  const user = await userService.getUserByEmail(email) as any;

  if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
  if (user['verificationCode'] !== code)
    return res.status(400).json({ error: 'Código incorrecto' });

  // Actualizar en Firestore a verificado
  const usersRef = db.collection('users');
  const snapshot = await usersRef.where('email', '==', email).get();
  if (!snapshot.empty) {
    await snapshot.docs[0].ref.update({ isVerified: true });
  }

  return res.status(200).json({ message: '✅ Cuenta verificada correctamente' });
};

// DEBUG: obtener usuario por email (solo para desarrollo)
export const debugGetUser = async (req: Request, res: Response) => {
  const email = String((req.query as any)['email'] || '');
  if (!email) return res.status(400).json({ error: 'email query required' });

  try {
    const usersRef = db.collection('users');
    const snapshot = await usersRef.where('email', '==', email).get();
    if (snapshot.empty) return res.status(404).json({ error: 'Usuario no encontrado' });
    return res.status(200).json(snapshot.docs[0].data());
  } catch (err: any) {
    console.error('debugGetUser error', err);
    return res.status(500).json({ error: 'internal' });
  }
};

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
    return res.status(201).json({ 
      message: 'Usuario registrado exitosamente', 
      user: { ...createdUser, password: undefined } 
    });
  } catch (error: any) {
    console.error('registerUser - Error durante el proceso:', error);
    const statusCode = error.code === 'auth/email-already-exists' ? 409 : 500;
    return res.status(statusCode).json({ 
      error: error.message || 'Error interno del servidor',
      code: error.code
    });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  console.log('loginUser - Body recibido:', { ...req.body, password: '[HIDDEN]' });
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email y password son requeridos' });
  }

  try {
    const user = await userService.validateUser(email, password);
    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Opcional: comprobar si el usuario está verificado
    if ((user as any).isVerified === false) {
      return res.status(403).json({ error: 'Cuenta no verificada' });
    }

    // Responder con información segura del usuario
    const safeUser = { ...user } as any;
    delete safeUser.password;

    return res.status(200).json({ message: 'Inicio de sesión exitoso', user: safeUser });
  } catch (err: any) {
    console.error('loginUser error', err);
    return res.status(500).json({ error: 'Error interno' });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { email, ...updates } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    // Remove undefined fields (Firestore doesn't accept undefined)
    Object.keys(updates).forEach(k => updates[k] === undefined && delete updates[k]);

    const usersRef = db.collection('users');
    const snapshot = await usersRef.where('email', '==', email).get();
    if (snapshot.empty) return res.status(404).json({ error: 'Usuario no encontrado' });

    const docRef = snapshot.docs[0].ref;
    // Add updatedAt timestamp
    updates.updatedAt = Date.now();

    await docRef.update(updates);

    const updatedDoc = (await docRef.get()).data();
    return res.status(200).json({ message: 'Usuario actualizado', user: updatedDoc });
  } catch (err: any) {
    console.error('updateUser error', err);
    return res.status(500).json({ error: 'internal' });
  }
};
