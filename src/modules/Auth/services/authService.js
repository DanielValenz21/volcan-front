// src/modules/Auth/services/authService.js
import axios from 'axios';

// Ajusta si tu backend corre en localhost:3001
const API_URL = 'http://localhost:3001/api/auth';

export const login = async (credentials) => {
  try {
    // El backend espera { nombreUsuario, password }
    // En tu formulario, usas { email, password }
    // Transformamos 'email' -> 'nombreUsuario'
    const payload = {
      nombreUsuario: credentials.email,
      password: credentials.password
    };

    // POST a http://localhost:3001/api/auth/login
    const response = await axios.post(`${API_URL}/login`, payload);
    // Respuesta: { token, user: { ... } }

    return response.data;
  } catch (error) {
    // Lanza un error si falla (401, etc.)
    throw new Error('Error durante el login');
  }
};
