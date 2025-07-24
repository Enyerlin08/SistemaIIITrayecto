import React, { useState, useEffect } from 'react';
import api from '../../../servicio/api';
import {
  Button,
  Label,
  Input,
} from '@windmill/react-ui';

const TipoModificar = ({ tipoId, onCloseModal, onModificarExitoso }) => {
  const [formData, setFormData] = useState({ nombre: '' });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  // Función para obtener el tipo por ID
  const obtenerTipoPorId = async (id) => {
    try {
      console.log('ID del tipo:', id);
      const response = await api.get(`/tipos/${id}`);
      console.log('Respuesta de la API:', response.data);
      if (response.data) {
        setFormData({
          nombre: response.data.nombre || '',
        });
      }
    } catch (error) {
      console.error('Error al obtener el tipo:', error);
      setMessage('Error al obtener los datos del tipo');
      setMessageType('danger');
    }
  };

  useEffect(() => {
    if (tipoId) {
      obtenerTipoPorId(tipoId);
    }
  }, [tipoId]);

  useEffect(() => {
    console.log('Estado de formData:', formData);
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const soloLetras = value.replace(/[^A-Za-záéíóúñÁÉÍÓÚÑ\s]/g, "");
    
    setFormData({ ...formData, [name]: soloLetras });

    if (value !== soloLetras) {
      setErrors({ ...errors, [name]: "Solo se permiten letras, espacios, ñ y tildes" });
    } else {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validarForm = () => {
    let formErrors = {};

    if (!formData.nombre) {
      formErrors.nombre = "El nombre del tipo es requerido";
    }
    else if (!/^[A-Za-záéíóúñÁÉÍÓÚÑ\s]+$/.test(formData.nombre)) {
      formErrors.nombre = "Solo se permiten letras, espacios, ñ y tildes";
    }

    return formErrors;
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();
    const formErrors = validarForm();
    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
      try {
        const response = await api.put(`/tipos/modificar/${tipoId}`, formData, {
          headers: { 'Content-Type': 'application/json' }
        });

        if (response.status === 200 || response.status === 201) {
          setMessage('Tipo actualizado con éxito');
          setMessageType('success');
          setFormData({ nombre: '' });
          if (onModificarExitoso) onModificarExitoso('Tipo actualizado con éxito', 'success');
          if (onCloseModal) onCloseModal();
        }
      } catch (error) {
        setMessage('Error al actualizar el tipo');
        setMessageType('danger');
        console.error('Error al actualizar el tipo:', error);
        if (onModificarExitoso) onModificarExitoso('Error: ' + error.response?.data?.error, 'danger');
      }
    }
  };

  return (
    <div>
      <h2>Modificar Tipo</h2>
      
      {message && (
        <div className={`mt-4 p-2 rounded-md ${messageType === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message}
        </div>
      )}
      
      <form onSubmit={manejarEnvio}>
        <div className="mb-4">
          <Label className="block">Nombre del Tipo</Label>
          <Input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className="mt-1"
            placeholder="Ej: Electrónico, Ropa"
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

export default TipoModificar;