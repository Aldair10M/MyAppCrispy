import bcrypt from 'bcrypt';

// Comparar contraseñas
export const comparePasswords = async (plainPassword: string, hashedPassword: string) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

// Generar código aleatorio de 6 dígitos
export const generateCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};
