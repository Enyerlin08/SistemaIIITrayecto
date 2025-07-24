import React, { useState, useEffect } from 'react';
import api from '../../../servicio/api'; 
import {
  Button,
  Label,
  Input,
} from '@windmill/react-ui';

const GradoModificar = ({ gradoId, onCloseModal, onModificarExitoso }) => {
  const [formData, setFormData] = useState({ nombre: '' });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  // Función para obtener por ID
  const obtenerGradoPorId = async (id) => {
    try {
      const response = await api.get(`/grados/${id}`);
      console.log('Respuesta de la API:', response.data); 
      if (response.data) {
        setFormData({
          nombre: response.data.nombre || '',
        });
      }
    } catch (error) {
      console.error('Error al obtener el grado:', error);
      setMessage('Error al obtener los datos');
      setMessageType('danger');
    }
  };

  useEffect(() => {
    if (gradoId) {
      obtenerGradoPorId(gradoId);
    }
  }, [gradoId]);

  // Verificar el estado de formData cuando cambia
  useEffect(() => {
  }, [formData]);

  // Función para manejar el cambio en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Eliminar números y caracteres no permitidos
    const soloLetras = value.replace(/[^A-Za-záéíóúñÁÉÍÓÚÑ\s1234567890]/g, "");

    // Actualizar el estado del campo
    setFormData({ ...formData, [name]: soloLetras });

    // Validar en tiempo real
    if (value !== soloLetras) {
      setErrors({ ...errors, [name]: "Se permiten números, letras, espacios, ñ y tildes" });
    } else {
      setErrors({ ...errors, [name]: "" }); // Limpiar el mensaje de error
    }
  };

  // Función para validar los campos antes de enviar el formulario
  const validarForm = () => {
    let formErrors = {};

    if (!formData.nombre) {
      formErrors.nombre = "El nombre del grado es requerido";
    }
    else if (!/^[A-Za-záéíóúñÁÉÍÓÚÑ\s1234567890]+$/.test(formData.nombre)) {
      formErrors.nombre = "Se permiten números letras, espacios, ñ y tildes";
    }

    return formErrors;
  };

  // Función para manejar el envío del formulario
  const manejarEnvio = async (e) => {
    e.preventDefault();
    const formErrors = validarForm();
    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
      try {
        const url = `/grados/modificar/${gradoId}`; // Ruta para modificar
        const method = "put"; // Método PUT para modificar

        const response = await api[method](url, formData, {
          headers: { 'Content-Type': 'application/json' }
        });

        if (response.status === 200 || response.status === 201) {
          setMessage('Grado actualizado con éxito');
          setMessageType('success');
          setFormData({ nombre: '' });
          if (onModificarExitoso) onModificarExitoso('Grado actualizado con éxito', 'success');
          if (onCloseModal) onCloseModal(); // Cerrar el modal al completar
        }
      } catch (error) {
        setMessage('Error al actualizar ');
        setMessageType('danger');
        console.error('Error al actualizar :', error);
        if (onModificarExitoso) onModificarExitoso('Error: ' + error.response?.data?.error, 'danger');
      }
    }
  };

  return (
    <div>
      
      {message && (
        <div className={`mt-4 p-2 rounded-md ${messageType === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message}
        </div>
      )}
      
      <form onSubmit={manejarEnvio}>
        <div className="mb-4">
          <Label className="block">Nombre del Grado</Label>
          <Input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className="mt-1"
          />
          {errors.nombre && <span className="text-red-500 text-sm mt-1">{errors.nombre}</span>}
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <Button 
            size="large" 
            layout="outline" 
            onClick={onCloseModal} 
          >
            Cancelar
          </Button>
          <Button 
            size="large" 
            layout="primary" 
            type="submit"
          >
            {messageType === 'success' ? 'Actualizando...' : 'Actualizar'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default GradoModificar;
