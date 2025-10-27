// src/app/core/models/user.model.ts

export class User {
  uid?: string;             // ID generado por Firebase
  username: string;         // Nombre de usuario
  birthdate: string;        // Fecha de nacimiento (YYYY-MM-DD)
  address: string;          // Dirección
  phone: string;            // Teléfono
  email: string;            // Correo electrónico
  password?: string;        // Contraseña (solo para registro)
  confirmPassword?: string; // Confirmación de contraseña (solo para registro)
  codigo?: string;          // Código de verificación (6 dígitos)
  createdAt?: number;       // Timestamp de creación
  updatedAt?: number;       // Timestamp de última actualización

  constructor(
    username: string,
    birthdate: string,
    address: string,
    phone: string,
    email: string,
    password?: string,
    confirmPassword?: string,
    codigo?: string,
    uid?: string,
    createdAt?: number,
    updatedAt?: number
  ) {
    this.username = username;
    this.birthdate = birthdate;
    this.address = address;
    this.phone = phone;
    this.email = email;
    this.password = password;
    this.confirmPassword = confirmPassword;
    this.codigo = codigo;
    this.uid = uid;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  /**
   * Devuelve la edad basada en birthdate
   */
  getAge(): number {
    const birth = new Date(this.birthdate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  }

  /**
   * Convierte la clase a un objeto plano para guardar en Firestore
   */
  toFirestore(): any {
    return {
      username: this.username,
      birthdate: this.birthdate,
      address: this.address,
      phone: this.phone,
      email: this.email,
      codigo: this.codigo,
      createdAt: this.createdAt || Date.now(),
      updatedAt: this.updatedAt || Date.now(),
    };
  }

  /**
   * Verifica si la contraseña y confirmPassword coinciden
   */
  passwordsMatch(): boolean {
    if (!this.password || !this.confirmPassword) return false;
    return this.password === this.confirmPassword;
  }
}
