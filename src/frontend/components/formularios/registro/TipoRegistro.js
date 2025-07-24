import React, { useState } from 'react';
import PageTitle from '../../Typography/PageTitle';
import {
  Button,
  Label, Input,
} from '@windmill/react-ui';
import axios from '../../../servicio/api'; // Importa axios desde tu configuración

function TipoRegistro({ closeModal, onRegistroExitoso }) {
    const [formData, setFormData] = useState({ nombre: '' });
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Función de manejo de validación en tiempo real
    const handleChange = (e) => {
        const { name, value } = e.target;

        // Eliminar números y caracteres no permitidos
        const soloLetras = value.replace(/[^A-Za-záéíóúñÁÉÍÓÚÑ\s]/g, "");

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
            formErrors.nombre = "El nombre del tipo es requerido";
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
                const response = await axios.post("/tipos/registrar", { 
                    nombre: formData.nombre 
                });

                if (response.status === 201) {
                    setMessage("Tipo registrado con éxito");
                    setMessageType("success");
                    setFormData({ nombre: '' }); // Limpiar el formulario
                    if (onRegistroExitoso) onRegistroExitoso();
                    setTimeout(() => {
                        if (closeModal) closeModal();
                    }, 1500);
                }
            } catch (error) {
                console.error("Error al registrar:", error.response?.data || error.message);
                setMessage(error.response?.data?.message || "Error al registrar el tipo");
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
            <PageTitle>Registrar Tipo</PageTitle>
            <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
                <Label className="mb-3 block">Nombre del Tipo</Label>
                <Input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    className="mt-1"
                    placeholder="Ingrese el nombre del tipo"
                />
                {errors.nombre && <span className="text-red-500 text-sm mt-1">{errors.nombre}</span>}
                
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

export default TipoRegistro;