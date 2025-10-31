export class User {
  uid?: string;
  username: string;
  birthdate: string;
  address: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword?: string;
  codigo?: string;
  createdAt?: number;
  updatedAt?: number;

  // 👇 Campos nuevos para verificación por correo
  isVerified: boolean;
  verificationCode?: string;

  constructor(
    username: string,
    birthdate: string,
    address: string,
    phone: string,
    email: string,
    password: string,
    confirmPassword?: string,
    codigo?: string,
    isVerified: boolean = false,
    verificationCode?: string
  ) {
    this.username = username;
    this.birthdate = birthdate;
    this.address = address;
    this.phone = phone;
    this.email = email;
    this.password = password;
    this.confirmPassword = confirmPassword;
    this.codigo = codigo;
    this.createdAt = Date.now();
    this.updatedAt = Date.now();

    // 👇 Inicializamos los nuevos
    this.isVerified = isVerified;
    this.verificationCode = verificationCode;
  }
}