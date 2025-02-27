import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../Auth/services/authService'; // Desde pages/ subimos un nivel y entramos a services/
import './Login.css';

const Login = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [rememberUser, setRememberUser] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setRememberUser(checked);
    } else {
      setCredentials({ ...credentials, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Llamada al servicio de autenticación
      const response = await login(credentials);
      if (response.token) {
        // Guarda el token según tu flujo (por ejemplo, en localStorage)
        localStorage.setItem('token', response.token);
        // Redirige a la siguiente vista (por ejemplo, /dashboard)
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Credenciales inválidas o error en el servidor');
      console.error('Error en login:', err);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Columna izquierda: Formulario */}
        <div className="login-form-side">
          <h1 className="login-title">Bienvenido</h1>
          <p className="login-subtitle">Ingresa a tu cuenta para continuar</p>
          <form onSubmit={handleSubmit} className="login-form">
            <label className="login-label" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={credentials.email}
              onChange={handleChange}
              className="login-input"
              placeholder="tu@email.com"
              required
            />
            <label className="login-label" htmlFor="password">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              className="login-input"
              placeholder="********"
              required
            />
            <div className="login-extra-options">
              <div className="remember-me">
                <input
                  type="checkbox"
                  id="rememberUser"
                  name="rememberUser"
                  checked={rememberUser}
                  onChange={handleChange}
                />
                <label htmlFor="rememberUser">Recordar usuario</label>
              </div>
              <a href="#!" className="forgot-link">
                ¿Olvidaste tu contraseña?
              </a>
            </div>
            {error && <p className="login-error">{error}</p>}
            <button type="submit" className="login-button">
              Iniciar sesión
            </button>
          </form>
          <div className="register-option">
            <p>
              ¿No tienes una cuenta?{' '}
              <a href="#!" className="register-link">
                Regístrate aquí
              </a>
            </p>
          </div>
        </div>

        {/* Columna derecha: Imagen/Placeholder */}
        <div className="login-image-side">
          <div className="image-placeholder">
            <span className="image-placeholder-text">Imagen o Logo</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
