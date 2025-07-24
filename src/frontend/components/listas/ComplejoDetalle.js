import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../../servicio/axio';
import Complejo from '../../pages/Complejo';

function ComplejoDetalle() {
    const { id } = useParams<{ id: string }>(Complejo);
    const [complejo, setComplejo] = useState<any>(null);

    const obtenerComplejo = async () => {
        try {
            const response = await api.get(`/api/complejos/${id}`);
            setComplejo(response.data);
        } catch (error) {
            console.error('Error al obtener el complejo:', error);
        }
    };

    useEffect(() => {
        obtenerComplejo();
    }, [id]);

    return (
        <div>
            {complejo ? (
                <div>
                    <h2>{complejo.nombre}</h2>
                    <p><strong>Código:</strong> {complejo.codigo}</p>
                    <p><strong>Asistencia Estudiante:</strong> {complejo.asistenciaestudiante}</p>
                    <p><strong>Fecha:</strong> {complejo.fecha}</p>
                    <p><strong>Persona:</strong> {complejo.nombrePersona} {complejo.apellido} ({complejo.cedula})</p>
                </div>
            ) : (
                <p>Cargando...</p>
            )}
        </div>
    );
}

export default ComplejoDetalle;