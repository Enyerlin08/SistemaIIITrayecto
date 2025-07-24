import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import hola from '../assets/img/verduras.jpg';
import { Label, Input, Button } from '@windmill/react-ui';

function Login() {
  const history = useHistory();
  const [usuario, setUsuario] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación personalizada
    if (!usuario || !contraseña) {
      setError('Todos los campos son requeridos');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: usuario, contraseña }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Error en el login');
        return;
      }

      const data = await response.json();
      localStorage.setItem('token', data.token);
      history.push('/app');
    } catch (err) {
      setError('Error al conectar con el servidor');
    }
  };

  return (
    <div className="flex items-center min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
      <div className="flex-1 h-full max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-xl dark:bg-gray-800">
        <div className="flex flex-col overflow-y-auto md:flex-row">
          <div className="h-32 md:h-auto md:w-1/2">
            <img
              aria-hidden="true"
              className="object-cover w-full h-full dark:hidden"
              src={hola}
              alt="Office"
            />
            <img
              aria-hidden="true"
              className="hidden object-cover w-full h-full dark:block"
              src={hola}
              alt="Office"
            />
          </div>
          <main className="flex items-center justify-center p-6 sm:p-12 md:w-1/2">
            <div className="w-full">
              <h1 className="mb-0 text-center font-semibold text-gray-700 dark:text-gray-200">SICIESA</h1>
              <h1 className="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-200">Iniciar Sesión</h1>

              {error && <p className="text-red-600 mb-4">{error}</p>}

              <form onSubmit={handleSubmit}>
                <Label>
                  <span>Usuario</span>
                  <Input
                    className="mt-1"
                    type="text"
                    placeholder="nombre de usuario"
                    value={usuario}
                    onChange={(e) => setUsuario(e.target.value)}
                  />
                </Label>

                <Label className="mt-4">
                  <span>Contraseña</span>
                  <Input
                    className="mt-1"
                    type="password"
                    placeholder="Contraseña"
                    value={contraseña}
                    onChange={(e) => setContraseña(e.target.value)}
                  />
                </Label>

                <Button className="mt-4" block type="submit">
                  Aceptar
                </Button>
              </form>

            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default Login;
