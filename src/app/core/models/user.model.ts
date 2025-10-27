export class User {
  username: string;
  birthdate: string;
  address: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword?: string;
  codigo?: string;

  constructor(
    username: string,
    birthdate: string,
    address: string,
    phone: string,
    email: string,
    password: string,
    confirmPassword?: string,
    codigo?: string
  ) {
    this.username = username;
    this.birthdate = birthdate;
    this.address = address;
    this.phone = phone;
    this.email = email;
    this.password = password;
    this.confirmPassword = confirmPassword;
    this.codigo = codigo;
  }
}
