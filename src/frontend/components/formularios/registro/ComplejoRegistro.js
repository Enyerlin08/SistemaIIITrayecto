import React, { useState, useEffect } from 'react';
import api from '../../../servicio/axio';
import PageTitle from '../../../components/Typography/PageTitle';
import {
  Button,
  Label, Input, Select
} from '@windmill/react-ui';
import axios from '../../../servicio/api';

function ComplejoRegistro({ closeModal, onRegistroExitoso }) {
    const [formData, setFormData] = useState({ nombre: '', codigo: '', asistenciaestudiante: '', fecha: '', idPersona: '' });
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [personas, setPersonas] = useState([]);

    const obtenerPersonas = async () => {
        try {
            const response = await api.get("/api/personas");
            setPersonas(response.data);
            console.log("datos de la api", response.data)
        } catch (error) {
            console.error('Error al obtener personas:', error);
        }
    };

    useEffect(() => {
        obtenerPersonas();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const validarForm = () => {
        let formErrors = {};

        if (!formData.nombre) formErrors.nombre = "El nombre del complejo es requerido";
        if (!formData.codigo) formErrors.codigo = "El código es requerido";
        if (!formData.asistenciaestudiante) formErrors.asistenciaestudiante = "Asistencia de estudiante es requerida";
        if (!formData.fecha) formErrors.fecha = "La fecha es requerida";
        if (!formData.idPersona) formErrors.idPersona = "Seleccione una persona";

        return formErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formErrors = validarForm();
        setErrors(formErrors);

        if (Object.keys(formErrors).length === 0) {
            setIsSubmitting(true);
            try {
                console.log("datos enviados", formData)

                const response = await axios.post("/complejos/registrar/", formData);
                console.log("datos enviados", formData)
                if (response.status === 201) {
                    setMessage("Complejo registrado con éxito");
                    setMessageType("success");
                    setFormData({ nombre: '', codigo: '', asistenciaestudiante: '', fecha: '', idPersona: '' });
                    if (onRegistroExitoso) onRegistroExitoso();
                    setTimeout(() => {
                        if (closeModal) closeModal();
                    }, 1000);
                }
            } catch (error) {
                console.error("Error al registrar el complejo:", error.response?.data || error.message);
                setMessage(error.response?.data?.message || "Error al registrar el complejo");
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
            <PageTitle>Registrar Complejo Educativo</PageTitle>
            <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
                <Label>
                    <span>Nombre</span>
                    <Input name="nombre" value={formData.nombre} onChange={handleChange} className="mt-1" placeholder="Nombre del complejo" />
                    {errors.nombre && <span className="text-red-500 text-sm">{errors.nombre}</span>}
                </Label>

                <Label className="mt-4">
                    <span>Código</span>
                    <Input type="number" name="codigo" value={formData.codigo} onChange={handleChange} className="mt-1" placeholder="Código del complejo" />
                    {errors.codigo && <span className="text-red-500 text-sm">{errors.codigo}</span>}
                </Label>

                <Label className="mt-4">
                    <span>Asistencia de Estudiantes</span>
                    <Input type="number" name="asistenciaestudiante" value={formData.asistenciaestudiante} onChange={handleChange} className="mt-1" placeholder="Asistencia" />
                    {errors.asistenciaestudiante && <span className="text-red-500 text-sm">{errors.asistenciaestudiante}</span>}
                </Label>

                <Label className="mt-4">
                    <span>Fecha</span>
                    <Input type="date" name="fecha" value={formData.fecha} onChange={handleChange} className="mt-1" />
                    {errors.fecha && <span className="text-red-500 text-sm">{errors.fecha}</span>}
                </Label>

                <Label className="mt-4">
                    <span>Persona Responsable</span>
                    <Select name="idPersona" value={formData.idPersona} onChange={handleChange} className="mt-1">
                        <option value="">Seleccione una persona</option>
                        {personas.map((persona) => (
                            <option key={persona.idPersona} value={persona.idPersona}>{persona.nombrePersona} {persona.apellido}</option>
                        ))}
                    </Select>
                    {errors.idPersona && <span className="text-red-500 text-sm">{errors.id}</span>}
                </Label>
                
                {message && (
                    <div className={`mt-4 p-2 rounded-md ${messageType === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{message}</div>
                )}
            </div>
            <div className="flex justify-end gap-4 mt-6">
                <Button layout="outline" onClick={closeModal} disabled={isSubmitting}>Cancelar</Button>
                <Button layout="primary" onClick={handleSubmit} disabled={isSubmitting}>{isSubmitting ? 'Registrando...' : 'Aceptar'}</Button>
            </div>
        </>
    );
}

export default ComplejoRegistro;

