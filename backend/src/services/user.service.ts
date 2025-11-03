import { db } from '../firebase';
import bcrypt from 'bcrypt';
import { User } from '../models/user.model';
import { sendVerificationEmail } from '../mailer/mailer';

export class UserService {

  async createUser(userData: User) {
    console.log('createUser - Inicio del proceso con datos:', { ...userData, password: '[HIDDEN]' });

    if (!userData.username || !userData.email || !userData.password) {
      console.log('createUser - Error: Faltan campos obligatorios');
      throw new Error('Campos obligatorios faltan');
    }

    try {

      console.log('createUser - Encriptando contraseña...');
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      userData.password = hashedPassword;

      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

      console.log('createUser - Creando referencia en Firestore...');
      const userRef = db.collection('users').doc();
      userData.uid = userRef.id;
      userData.createdAt = Date.now();
      userData.updatedAt = Date.now();
      userData.verificationCode = verificationCode;
      userData.isVerified = false;

      console.log('createUser - Preparando datos para Firestore...');
      const dataToSave: any = {};
      Object.keys(userData).forEach((k) => {
        if (k !== 'confirmPassword') {  
          const val = (userData as any)[k];
          if (val !== undefined) dataToSave[k] = val;
        }
      });
      console.log('createUser - Datos a guardar:', { ...dataToSave, password: '[HIDDEN]' });

      console.log('createUser - Guardando en Firestore...');
      await userRef.set(dataToSave);
      console.log('createUser - Usuario guardado exitosamente');

      await sendVerificationEmail(userData.email, verificationCode);
      console.log(`✅ Usuario ${userData.email} registrado y correo enviado`);

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

  async validateUser(email: string, plainPassword: string) {
    const user = await this.getUserByEmail(email);
    if (!user) return null;

    const hashed = (user as any).password;
    if (!hashed) return null;

    const match = await bcrypt.compare(plainPassword, hashed);
    if (!match) return null;

    const safeUser = { ...user } as any;
    delete safeUser.password;
    delete safeUser.confirmPassword;
    return safeUser;
  }

}
