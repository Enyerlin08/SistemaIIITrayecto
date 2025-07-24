import React, { useState, useEffect } from 'react';
import api from '../../../servicio/axio';
import PageTitle from '../../../components/Typography/PageTitle';
import {
  Button,
  Label, Input, Select
} from '@windmill/react-ui';
import axios from '../../../servicio/api';

function UsuarioRegistro({ closeModal, onRegistroExitoso }) {
  const [formData, setFormData] = useState({ contraseña: '', nombre: '', tipousuario: '', idPersona: '' });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [personas, setPersonas] = useState([]);

  const obtenerPersonas = async () => {
    try {
      const response = await api.get("/api/personas");
      const datosInvertidos = response.data.reverse();
      setPersonas(datosInvertidos);
    } catch (error) {
      // Error al obtener personas
    }
  };

  useEffect(() => {
    obtenerPersonas();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    let newValue = value;

    if (name === "idPersona") {
      newValue = value === "" ? "" : value;
    } else {
      newValue = value.replace(/[^A-Z0-9a-záéíóúñÁÉÍÓÚÑ\s]/g, "");
    }

    setFormData({ ...formData, [name]: newValue });

    if (name !== "idPersona" && value !== newValue) {
      setErrors({ ...errors, [name]: "Solo se permiten letras, espacios, ñ y tildes" });
    } else {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validarForm = () => {
    let formErrors = {};

    if (!formData.tipousuario) {
      formErrors.tipousuario = "El tipo de usuario es requerido";
    } else if (!/^[A-Za-záéíóúñÁÉÍÓÚÑ\s]+$/.test(formData.tipousuario)) {
      formErrors.tipousuario = "Solo se permiten letras, espacios, ñ y tildes";
    }

    if (!formData.idPersona) {
      formErrors.idPersona = "Debe seleccionar una persona";
    } else if (isNaN(Number(formData.idPersona))) {
      formErrors.idPersona = "Debe seleccionar una persona válida";
    }

    if (!formData.nombre) {
      formErrors.nombre = "El nombre de usuario es requerido";
    }

    if (!formData.contraseña) {
      formErrors.contraseña = "La contraseña es requerida";
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
        const response = await axios.post("/usuarios/registrar", {
          contraseña: formData.contraseña,
          nombre: formData.nombre,
          tipousuario: formData.tipousuario,
          idPersona: Number(formData.idPersona),
        });

        if (response.status === 201) {
          setMessage("Usuario registrado con éxito");
          setMessageType("success");
          setFormData({ contraseña: '', nombre: '', tipousuario: '', idPersona: '' });
          if (onRegistroExitoso) onRegistroExitoso();
          setTimeout(() => {
            if (closeModal) closeModal();
          }, 1000);
        }
      } catch (error) {
        setMessage(error.response?.data?.error || "Error al registrar el usuario");
        setMessageType("danger");
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setMessage("Por favor corrige los errores");
      setMessageType("danger");
    }
  };

  return (
    <>
      <PageTitle>Registrar Usuario</PageTitle>
      <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <Label className="mb-3 block">
          <span>Nombre de Usuario</span>
          <Input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className="mt-1"
            placeholder="Ingrese el nombre"
          />
          {errors.nombre && <span className="text-red-500 text-sm mt-1">{errors.nombre}</span>}
        </Label>

        <Label className="mb-3 block">
          <span>Contraseña</span>
          <Input
            type="text"
            name="contraseña"
            value={formData.contraseña}
            onChange={handleChange}
            className="mt-1"
            placeholder="Ingrese la contraseña"
          />
          {errors.contraseña && <span className="text-red-500 text-sm mt-1">{errors.contraseña}</span>}
        </Label>

        <Label className="mt-4 block">
          <span>Persona</span>
          <Select
            className="mt-1"
            name="idPersona"
            value={formData.idPersona}
            onChange={handleChange}
          >
            <option value="">Seleccione</option>
            {personas.map((persona) => (
              <option key={persona.idPersona} value={String(persona.idPersona)}>
                {persona.nombrePersona} {persona.apellido}
              </option>
            ))}
          </Select>
          {errors.idPersona && <span className="text-red-500 text-sm mt-1">{errors.idPersona}</span>}
        </Label>

        <Label className="mt-4 block">
          <span>Tipo de usuario</span>
          <Select
            className="mt-1"
            name="tipousuario"
            value={formData.tipousuario}
            onChange={handleChange}
          >
            <option value="">Seleccione</option>
            <option value="Tecnico">Tecnico</option>
            <option value="Administrador">Administrador</option>
            <option value="Asistente">Asistente</option>
          </Select>
          {errors.tipousuario && <span className="text-red-500 text-sm mt-1">{errors.tipousuario}</span>}
        </Label>

        {message && (
          <div
            className={`mt-4 p-2 rounded-md ${
              messageType === "success"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {message}
          </div>
        )}
      </div>

      <div className="flex justify-end gap-4 mt-6">
        <Button size="large" layout="outline" onClick={closeModal} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button size="large" layout="primary" onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? "Registrando..." : "Aceptar"}
        </Button>
      </div>
    </>
  );
}

export default UsuarioRegistro;
