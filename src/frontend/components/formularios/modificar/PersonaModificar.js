import React, { useState, useEffect } from 'react';
import api from '../../../servicio/api';
import {
  Button,
  Label,
  Input,
  Select
} from '@windmill/react-ui';

const PersonaModificar = ({ personaId, onCloseModal, onModificarExitoso }) => {
  const [formData, setFormData] = useState({
    cedula: '',
    nombre: '',
    apellido: '',
    idCargo: ''
  });
  
  const [cargos, setCargos] = useState([]);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  // Obtener lista de cargos
  const obtenerCargos = async () => {
    try {
      const response = await api.get('/cargos');
      setCargos(response.data);
    } catch (error) {
      console.error('Error al obtener cargos:', error);
    }
  };

  // Obtener datos de la persona
  const obtenerPersonaPorId = async (id) => {
    try {
      const response = await api.get(`/personas/${id}`);
      setFormData({
        cedula: response.data.cedula || '',
        nombre: response.data.nombre || '',
        apellido: response.data.apellido || '',
        idCargo: response.data.idCargo || ''
      });
    } catch (error) {
      setMessage('Error al obtener datos de la persona');
      setMessageType('danger');
    }
  };

  useEffect(() => {
    obtenerCargos();
    if (personaId) obtenerPersonaPorId(personaId);
  }, [personaId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let valorValido = value;

    // Validaciones en tiempo real
    switch(name) {
      case 'cedula':
        valorValido = value.replace(/\D/g, ''); // Solo números
        break;
      case 'nombre':
      case 'apellido':
        valorValido = value.replace(/[^A-Za-záéíóúñÁÉÍÓÚÑ\s]/g, '');
        break;
    }

    setFormData({ ...formData, [name]: valorValido });
    
    // Manejo de errores
    const nuevosErrores = { ...errors };
    if (value !== valorValido) {
      nuevosErrores[name] = name === 'cedula' 
        ? "Solo se permiten números" 
        : "Solo se permiten letras y espacios";
    } else {
      delete nuevosErrores[name];
    }
    setErrors(nuevosErrores);
  };

  const validarForm = () => {
    const nuevosErrores = {};
    const camposRequeridos = ['cedula', 'nombre', 'apellido', 'idCargo'];

    camposRequeridos.forEach(campo => {
      if (!formData[campo]) {
        nuevosErrores[campo] = "Este campo es requerido";
      }
    });

    if (formData.cedula.length < 6) {
      nuevosErrores.cedula = "Cédula inválida";
    }

    setErrors(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();
    if (!validarForm()) return;

    try {
      const response = await api.put(`/personas/modificar/${personaId}`, formData);
      
      if (response.status === 200 || response.status === 201) {
        setMessage('Persona actualizada correctamente');
        setMessageType('success');
        setFormData({ cedula: '',
            nombre: '',
            apellido: '',
            idCargo: ''});
          if (onModificarExitoso) onModificarExitoso('Cargo actualizado con éxito', 'success');
          if (onCloseModal) onCloseModal(); // Cerrar el modal al completar
        }
      } catch (error) {
        setMessage('Error al actualizar ');
        setMessageType('danger');
        console.error('Error al actualizar :', error);
        if (onModificarExitoso) onModificarExitoso('Error: ' + error.response?.data?.error, 'danger');
      }
  };

  return (
    <div>
      <h2>Modificar Persona</h2>
      
      {message && (
        <div className={`mt-4 p-2 rounded-md ${messageType === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message}
        </div>
      )}

      <form onSubmit={manejarEnvio}>
        <div className="grid gap-4 mb-4">
          {/* Campo Cédula */}
          <div>
            <Label>Cédula</Label>
            <Input
              name="cedula"
              value={formData.cedula}
              onChange={handleChange}
              maxLength="10"
            />
            {errors.cedula && <span className="text-red-500 text-sm">{errors.cedula}</span>}
          </div>

          {/* Campo Nombre */}
          <div>
            <Label>Nombre</Label>
            <Input
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
            />
            {errors.nombre && <span className="text-red-500 text-sm">{errors.nombre}</span>}
          </div>

          {/* Campo Apellido */}
          <div>
            <Label>Apellido</Label>
            <Input
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
            />
            {errors.apellido && <span className="text-red-500 text-sm">{errors.apellido}</span>}
          </div>

          {/* Selector de Cargo */}
          <div>
            <Label>Cargo</Label>
            <Select
              name="idCargo"
              value={formData.idCargo}
              onChange={handleChange}
            >
              <option value="">Seleccione un cargo</option>
              {cargos.map(cargo => (
                <option key={cargo.id} value={cargo.id}>
                  {cargo.nombre}
                </option>
              ))}
            </Select>
            {errors.idCargo && <span className="text-red-500 text-sm">{errors.idCargo}</span>}
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <Button layout="outline" onClick={onCloseModal}>
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

export default PersonaModificar;