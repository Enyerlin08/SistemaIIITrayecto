import React, { useState } from 'react';
import PageTitle from '../../../components/Typography/PageTitle';
import {
  Button,
  Label,
  Input,
} from '@windmill/react-ui';
import axios from '../../../servicio/api';

function GradoRegistro({ closeModal, onRegistroExitoso }) {
  const [formData, setFormData] = useState({ nombre: '' });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const soloLetras = value.replace(/[^A-Za-záéíóúñÁÉÍÓÚÑ\s1234567890]/g, '');
    setFormData({ ...formData, [name]: soloLetras });

    if (value !== soloLetras) {
      setErrors({ ...errors, [name]: 'Se permiten números, letras, espacios, ñ y tildes' });
    } else {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validarForm = () => {
    const formErrors = {};
    if (!formData.nombre) {
      formErrors.nombre = 'El nombre del grado es requerido';
    } else if (!/^[A-Za-záéíóúñÁÉÍÓÚÑ\s1234567890]+$/.test(formData.nombre)) {
      formErrors.nombre = 'Se permiten números letras, espacios, ñ y tildes';
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
        const response = await axios.post('/grados/registrar', {
          nombre: formData.nombre,
        });

        if (response.status === 201) {
          setMessage("Grado registrado con éxito");
          setMessageType("success");
          setFormData({ nombre: '' });

          // Avisar al componente padre
          if (onRegistroExitoso) onRegistroExitoso();
        }
      } catch (error) {
        console.error('Error al registrar:', error.response?.data || error.message);
        setMessage(error.response?.data?.message || 'Error al registrar');
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
      <PageTitle>Registrar Grado</PageTitle>
      <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <Label className="mb-3 block">Nombre del Grado</Label>
        <Input
          type="text"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          className="mt-1"
          placeholder="Ingrese el nombre del grado"
        />
        {errors.nombre && (
          <span className="text-red-500 text-sm mt-1">{errors.nombre}</span>
        )}

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
          {isSubmitting ? 'Registrando...' : 'Aceptar'}
        </Button>
      </div>
    </>
  );
}

export default GradoRegistro;
