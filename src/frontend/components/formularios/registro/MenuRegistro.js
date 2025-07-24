import React, { useState, useEffect } from 'react';
import PageTitle from '../../../components/Typography/PageTitle';
import { Button, Label, Input, Select } from '@windmill/react-ui';
import axios from '../../../servicio/api';

function MenuRegistro({ closeModal, onRegistroExitoso }) {
  const [formData, setFormData] = useState({ nombre: '', platos: [{ idPlato: '' }] });
  const [platosDisponibles, setPlatosDisponibles] = useState([]);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchPlatos();
  }, []);

  const fetchPlatos = async () => {
    try {
      const response = await axios.get('platos/disponibles');
      console.log('Platos recibidos:', response.data); // Depuración
      setPlatosDisponibles(response.data);
    } catch (error) {
      console.error('Error al cargar platos:', error);
      setMessage('Error al cargar los platos');
      setMessageType('danger');
    }
  };

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    if (name === 'nombre') {
      setFormData({ ...formData, [name]: value });
      if (!value) {
        setErrors({ ...errors, nombre: 'El nombre es requerido' });
      } else {
        const newErrors = { ...errors };
        delete newErrors.nombre;
        setErrors(newErrors);
      }
    } else if (name === 'idPlato') {
      const newPlatos = [...formData.platos];
      newPlatos[index] = { idPlato: value };
      setFormData({ ...formData, platos: newPlatos });

      const newErrors = { ...errors };
      if (!value) {
        newErrors[`idPlato_${index}`] = 'Seleccione un plato';
      } else {
        delete newErrors[`idPlato_${index}`];
      }
      setErrors(newErrors);
    }
  };

  const addPlato = () => {
    setFormData({ ...formData, platos: [...formData.platos, { idPlato: '' }] });
  };

  const removePlato = (index) => {
    const newPlatos = formData.platos.filter((_, i) => i !== index);
    setFormData({ ...formData, platos: newPlatos });

    const newErrors = { ...errors };
    delete newErrors[`idPlato_${index}`];
    setErrors(newErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = {};
    if (!formData.nombre) formErrors.nombre = 'El nombre es requerido';
    formData.platos.forEach((plato, index) => {
      if (!plato.idPlato) {
        formErrors[`idPlato_${index}`] = 'Seleccione un plato';
      }
    });

    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
      setIsSubmitting(true);
      try {
        const payload = {
          nombre: formData.nombre,
          platos: formData.platos.map(p => ({ idPlato: parseInt(p.idPlato) })),
        };
        const response = await axios.post('menus/registrar', payload);
        setMessage('Menú registrado con éxito');
        setMessageType('success');
        setFormData({ nombre: '', platos: [{ idPlato: '' }] });
        if (onRegistroExitoso) onRegistroExitoso();
        setTimeout(() => {
          setMessage('');
          setMessageType('');
        }, 3000);
      } catch (error) {
        setMessage('Error al registrar el menú');
        setMessageType('danger');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <>
      <PageTitle>Registrar Menú</PageTitle>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md dark:bg-gray-800">
        <Label>
          Nombre del Menú
          <Input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={(e) => handleChange(e)}
            className="mt-1 w-full"
            placeholder="Ingrese el nombre del menú"
          />
        </Label>
        {errors.nombre && <p className="text-red-500 text-sm mt-1">{errors.nombre}</p>}

        <div className="mt-4">
          <Label>Platos</Label>
          {formData.platos.map((plato, index) => (
            <div key={index} className="flex items-center gap-4 mt-2">
              <Select
                name="idPlato"
                value={plato.idPlato}
                onChange={(e) => handleChange(e, index)}
                className="mt-1 w-full"
              >
                <option value="">Seleccione un plato</option>
                {platosDisponibles.map((p) => (
                  <option key={p.id} value={p.id}>{p.nombre}</option>
                ))}
              </Select>
              {errors[`idPlato_${index}`] && <p className="text-red-500 text-sm">{errors[`idPlato_${index}`]}</p>}
              {formData.platos.length > 1 && (
                <Button layout="outline" onClick={() => removePlato(index)} type="button">
                  Quitar
                </Button>
              )}
            </div>
          ))}
          <Button layout="link" className="mt-2" type="button" onClick={addPlato}>
            + Agregar Plato
          </Button>
        </div>

        {message && (
          <p className={`mt-4 text-sm ${messageType === 'success' ? 'text-green-500' : 'text-red-500'}`}>
            {message}
          </p>
        )}

        <div className="mt-6 flex justify-end gap-4">
          <Button type="button" layout="outline" onClick={closeModal} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Registrando...' : 'Registrar'}
          </Button>
        </div>
      </form>
    </>
  );
}

export default MenuRegistro;