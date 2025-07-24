import React, { useState, useEffect } from 'react';
import api from '../../../servicio/axio';
import PageTitle from '../../../components/Typography/PageTitle';
import {
  Button,
  Label, Input, Select
} from '@windmill/react-ui';
import axios from '../../../servicio/api'; // Importa axios desde tu configuración

function PersonaRegistro({ closeModal, onRegistroExitoso }) {
    const [formData, setFormData] = useState({ cedula:'', nombre: '', apellido:'', idCargo:'' });
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [cargos, setCargos] = useState([])

    const obtenerCargos = async () => {
        try {
          const response = await api.get("/api/cargos")
          const datosInvertidos = response.data.reverse(); // Invertir los datos
        setCargos(datosInvertidos);
        } catch (error) {
          console.error('Error al obtener los cargos:', error)
        }
      };
      useEffect(() => {
      obtenerCargos()
    }, []);

    // Función de manejo de validación en tiempo real
    const handleChange = (e) => {
        const { name, value } = e.target;

        // Eliminar números y caracteres no permitidos
        const soloLetras = value.replace(/[^A-Z0-9a-záéíóúñÁÉÍÓÚÑ\s]/g, "");

        // Actualizar el estado del campo
        setFormData({ ...formData, [name]: soloLetras });

        // Validar en tiempo real
        if (value !== soloLetras) {
            setErrors({ ...errors, [name]: "Solo se permiten letras, espacios, ñ y tildes" });
        } else {
            setErrors({ ...errors, [name]: "" }); // Limpiar el mensaje de error
        }
    };

    // Función de validación al enviar el formulario
    const validarForm = () => {
        let formErrors = {};

        // Validar que el campo no esté vacío
        if (!formData.nombre) {
            formErrors.nombre = "El nombre de persona es requerido";
        }
        // Validar que solo contenga letras, espacios, ñ y tildes
        else if (!/^[A-Za-záéíóúñÁÉÍÓÚÑ\s]+$/.test(formData.nombre)) {
            formErrors.nombre = "Solo se permiten letras, espacios, ñ y tildes";
        }

        return formErrors;
    };

    // Función para manejar el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formErrors = validarForm();
        setErrors(formErrors);

        if (Object.keys(formErrors).length === 0) {
            setIsSubmitting(true);
            try {
                const response = await axios.post("/personas/registrar", { 
                    nombre: formData.nombre, cedula: formData.cedula, apellido: formData.apellido, idCargo: formData.idCargo
                });

                if (response.status === 201) {
                    setMessage("Persona registrada con éxito");
                    setMessageType("success");
                    setFormData({ nombre: '' }); // Limpiar el formulario
                    if (onRegistroExitoso) onRegistroExitoso();
                    setTimeout(() => {
                        if (closeModal) closeModal();
                    }, 1000);
                }
            } catch (error) {
                console.error("Error al registrar:", error.response?.data || error.message);
                setMessage(error.response?.data?.message || "Error al registrar la persona");
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
            <PageTitle>Registrar Persona</PageTitle>
            <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
                <Label className="mb-3 block"></Label>
                <span>Cédula</span>
                <Input
                    type="text"
                    name="cedula"
                    value={formData.cedula}
                    onChange={handleChange}
                    className="mt-1"
                    placeholder="Ingrese la cedula"
                />
                {errors.cedula && <span className="text-red-500 text-sm mt-1">{errors.cedula}</span>}
                
                <Label className="mb-3 block"></Label>
                <span>Nombre</span>
                <Input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    className="mt-1"
                    placeholder="Ingrese el nombre"
                />
                {errors.nombre && <span className="text-red-500 text-sm mt-1">{errors.nombre}</span>}

                <Label className="mt-4"></Label>
                <span>Apellido</span>
                <Input
                    type="text"
                    name="apellido"
                    value={formData.apellido}
                    onChange={handleChange}
                    className="mt-1"
                    placeholder="Ingrese el apellido"
                />
                {errors.apellido && <span className="text-red-500 text-sm mt-1">{errors.apellido}</span>}

                <Label className="mt-4">
                <span>Cargo</span>
                <Select className="mt-1"
                    name="idCargo"
                    value={formData.idCargo}
                    onChange={handleChange}>
                    <option>Seleccione un cargo</option>
                    {cargos.map((cargo) => (
                    <option key={cargo.id} value={cargo.id}>
                        {cargo.nombre}
                    </option>
                    ))}
                </Select>
                </Label>

                {message && (
                    <div className={`mt-4 p-2 rounded-md ${
                        messageType === 'success' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                    }`}>
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

export default PersonaRegistro;