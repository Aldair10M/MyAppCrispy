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
  isVerified: boolean;
  verificationCode?: string;
  role?: number; // 1: Admin, 2: Cocinero, 3: Cliente

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
    verificationCode?: string,
    role: number = 3
  ) 
  
  {
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

    this.isVerified = isVerified;
    this.verificationCode = verificationCode;
    this.role = role;
  }
}