import React, { useState, useEffect } from 'react';
import PageTitle from '../../../components/Typography/PageTitle';
import {
  Button,
  Label,
  Input,
  Textarea,
} from '@windmill/react-ui';
import axios from '../../../servicio/api';

function PlatoModificar({ platoId, closeModal, onModificarExitoso }) {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cargar datos del plato
  useEffect(() => {
    const fetchPlato = async () => {
      try {
        const response = await axios.get(`/api/platos/${platoId}`);
        const plato = response.data;
        setFormData({
          nombre: plato.nombre,
          descripcion: plato.descripcion || '',
        });
      } catch (error) {
        setMessage('Error al cargar los datos del plato');
        setMessageType('danger');
      }
    };
    fetchPlato();
  }, [platoId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    const newErrors = { ...errors };
    if (name === 'nombre') {
      if (!value) {
        newErrors.nombre = 'El nombre del plato es requerido';
      } else if (!/^[A-Za-záéíóúñÁÉÍÓÚÑ\s]+$/.test(value)) {
        newErrors.nombre = 'Solo se permiten letras, espacios, ñ y tildes';
      } else {
        delete newErrors.nombre;
      }
    } else {
      delete newErrors[name];
    }
    setErrors(newErrors);
  };

  const validarForm = () => {
    const formErrors = {};
    if (!formData.nombre) {
      formErrors.nombre = 'El nombre del plato es requerido';
    } else if (!/^[A-Za-záéíóúñÁÉÍÓÚÑ\s]+$/.test(formData.nombre)) {
      formErrors.nombre = 'Solo se permiten letras, espacios, ñ y tildes';
    }
    return formErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validarForm();
    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
      setIsSubmitting(true);
      try {
        const response = await axios.put(`/api/platos/modificar/${platoId}`, {
          nombre: formData.nombre,
          descripcion: formData.descripcion || null,
        });

        if (response.status === 200) {
          setMessage('Plato modificado con éxito');
          setMessageType('success');
          if (onModificarExitoso) onModificarExitoso();
        }
      } catch (error) {
        console.error('Error al modificar:', error.response?.data || error.message);
        setMessage(error.response?.data?.error || 'Error al modificar el plato');
        setMessageType('danger');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setMessage('Por favor corrige los errores');
      setMessageType('danger');
    }
  };

  return (
    <>
      <PageTitle>Modificar Plato</PageTitle>
      <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <Label className="mb-3 block">Nombre del Plato</Label>
        <Input
          type="text"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          className="mt-1"
          placeholder="Ingrese el nombre del plato"
        />
        {errors.nombre && (
          <span className="text-red-500 text-sm mt-1">{errors.nombre}</span>
        )}

        <Label className="mt-4 mb-3 block">Descripción (Opcional)</Label>
        <Textarea
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
          className="mt-1"
          placeholder="Ingrese una descripción del plato"
        />

        {message && (
          <div
            className={`mt-4 p-2 rounded-md ${
              messageType === 'success'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {message}
          </div>
        )}
      </div>
      <div className="flex justify-end gap-4 mt-6">
        <Button
          size="large"
          layout="outline"
          onClick={closeModal}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button
          size="large"
          layout="primary"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Modificando...' : 'Aceptar'}
        </Button>
      </div>
    </>
  );
}

export default PlatoModificar;