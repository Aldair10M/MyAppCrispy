import { User } from './user';

describe('User', () => {
  let testUser: User;

  beforeEach(() => {
    // Creamos un usuario de ejemplo
    testUser = new User(
      'eduardo',             // username
      '1995-01-01',          // birthdate
      'Av. Siempre Viva 123',// address
      '987654321',           // phone
      'edu@example.com',     // email
      '123456',              // password (opcional)
      '123456',              // confirmPassword (opcional)
      '654321'               // codigo (opcional)
    );
  });

  it('should create an instance', () => {
    expect(testUser).toBeTruthy();
    expect(testUser.username).toBe('eduardo');
    expect(testUser.email).toBe('edu@example.com');
  });

  it('should calculate correct age', () => {
    const age = testUser.getAge();
    const currentYear = new Date().getFullYear();
    expect(age).toBe(currentYear - 1995);
  });

  it('should confirm passwords match', () => {
    expect(testUser.passwordsMatch()).toBe(true);

    // Cambiamos confirmPassword y debe fallar
    testUser.confirmPassword = '000000';
    expect(testUser.passwordsMatch()).toBe(false);
  });

  it('should convert to Firestore object', () => {
    const obj = testUser.toFirestore();
    expect(obj).toEqual(jasmine.objectContaining({
      username: 'eduardo',
      birthdate: '1995-01-01',
      address: 'Av. Siempre Viva 123',
      phone: '987654321',
      email: 'edu@example.com',
      codigo: '654321',
      createdAt: jasmine.any(Number),
      updatedAt: jasmine.any(Number)
    }));
  });
});

