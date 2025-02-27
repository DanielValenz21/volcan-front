export const login = async (credentials) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (credentials.email === 'admin@test.com' && credentials.password === 'admin') {
        resolve({ token: 'fake-jwt-token-admin' });
      } else {
        reject(new Error('Credenciales incorrectas'));
      }
    }, 800);
  });
};
