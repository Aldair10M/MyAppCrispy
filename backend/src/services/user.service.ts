import { db } from '../firebase';
import bcrypt from 'bcrypt';
import { User } from '../models/user.model';

export class UserService {

  async createUser(userData: User) {
    console.log('createUser - Inicio del proceso con datos:', { ...userData, password: '[HIDDEN]' });

    if (!userData.username || !userData.email || !userData.password) {
      console.log('createUser - Error: Faltan campos obligatorios');
      throw new Error('Campos obligatorios faltan');
    }

    try {
      // Encriptar la contraseña
      console.log('createUser - Encriptando contraseña...');
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      userData.password = hashedPassword;

      console.log('createUser - Creando referencia en Firestore...');
      const userRef = db.collection('users').doc();
      userData.uid = userRef.id;
      userData.createdAt = Date.now();
      userData.updatedAt = Date.now();

      // Remove undefined fields because Firestore rejects undefined values
      console.log('createUser - Preparando datos para Firestore...');
      const dataToSave: any = {};
      Object.keys(userData).forEach((k) => {
        const val = (userData as any)[k];
        if (val !== undefined) dataToSave[k] = val;
      });
      console.log('createUser - Datos a guardar:', { ...dataToSave, password: '[HIDDEN]' });

      console.log('createUser - Guardando en Firestore...');
      await userRef.set(dataToSave);
      console.log('createUser - Usuario guardado exitosamente');
      
      return userData;
    } catch (error) {
      console.error('createUser - Error durante el proceso:', error);
      throw error;
    }
  }

  async getUserByEmail(email: string) {
    const usersRef = db.collection('users');
    const snapshot = await usersRef.where('email', '==', email).get();
    if (snapshot.empty) return null;
    return snapshot.docs[0].data();
  }

  // Aquí puedes agregar login, verificar código, actualizar usuario, etc.
}
