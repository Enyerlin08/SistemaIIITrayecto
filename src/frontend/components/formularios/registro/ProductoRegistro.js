import React, { useState, useEffect } from 'react';
import api from '../../../servicio/axio';
import PageTitle from '../../../components/Typography/PageTitle';
import {
  Button,
  Label, Input, Select
} from '@windmill/react-ui';
import axios from '../../../servicio/api';

function ProductoRegistro({ closeModal, onRegistroExitoso }) {
  const [formData, setFormData] = useState({
    nombre: '',
    kilogramo: '',
    fechavencimiento: '',
    foto: '',
    idTipo: '',
    idMarca: ''
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tipos, setTipos] = useState([]);
  const [marcas, setMarcas] = useState([]);

  const obtenerTipos = async () => {
    try {
      const response = await api.get("/api/tipos");
      setTipos(response.data);
    } catch (error) {
      console.error('Error al obtener tipos:', error);
    }
  };

  const obtenerMarcas = async () => {
    try {
      const response = await api.get("/api/marcas");
      setMarcas(response.data);
    } catch (error) {
      console.error('Error al obtener marcas:', error);
    }
  };

  useEffect(() => {
    obtenerTipos();
    obtenerMarcas();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "foto") {
      console.log(`[handleChange] Archivo seleccionado para ${name}:`, files[0]);
      setFormData({ ...formData, [name]: files[0] });
    } else {
      // Guardar todo como string (incluyendo idTipo y idMarca)
      console.log(`[handleChange] Cambio en ${name}:`, value, `(tipo: ${typeof value})`);
      setFormData({ ...formData, [name]: value });
    }
  };

  const validarForm = () => {
    let formErrors = {};

    if (!formData.nombre) formErrors.nombre = "El nombre del producto es requerido";
    if (!formData.kilogramo) formErrors.kilogramo = "Los kilogramos son requeridos";
    if (!formData.fechavencimiento) formErrors.fechavencimiento = "La fecha es requerida";
    if (!formData.foto) formErrors.foto = "La foto es requerida";
    if (!formData.idTipo) formErrors.idTipo = "Seleccione un tipo";
    if (!formData.idMarca) formErrors.idMarca = "Seleccione una marca";

    return formErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formErrors = validarForm();
    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
      setIsSubmitting(true);
      try {
        const data = new FormData();

        // Convertir idTipo y idMarca a enteros antes de enviarlos
        const enviarData = {
          ...formData,
          idTipo: formData.idTipo === '' ? '' : parseInt(formData.idTipo, 10),
          idMarca: formData.idMarca === '' ? '' : parseInt(formData.idMarca, 10),
        };

        for (const key in enviarData) {
          console.log(`[handleSubmit] Agregando a FormData: ${key} =`, enviarData[key]);
          data.append(key, enviarData[key]);
        }

        console.log('[handleSubmit] Enviando formulario con datos:', enviarData);

        const response = await axios.post("/productos/registrar/", data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        console.log('[handleSubmit] Respuesta del servidor:', response);

        if (response.status === 201) {
          setMessage("Producto registrado con éxito");
          setMessageType("success");
          setFormData({
            nombre: '',
            kilogramo: '',
            fechavencimiento: '',
            foto: '',
            idTipo: '',
            idMarca: ''
          });
          if (onRegistroExitoso) onRegistroExitoso();
          setTimeout(() => {
            if (closeModal) closeModal();
          }, 1000);
        }
      } catch (error) {
        console.error("[handleSubmit] Error al registrar el producto:", error.response?.data || error.message);
        setMessage(error.response?.data?.message || "Error al registrar el producto");
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
      <PageTitle>Registrar Producto</PageTitle>
      <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <Label>
          <span>Nombre</span>
          <Input
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className="mt-1"
            placeholder="Nombre del producto"
          />
          {errors.nombre && <span className="text-red-500 text-sm">{errors.nombre}</span>}
        </Label>

        <Label className="mt-4">
          <span>Kilogramos</span>
          <Input
            type="number"
            name="kilogramo"
            value={formData.kilogramo}
            onChange={handleChange}
            className="mt-1"
            placeholder="Kilogramos"
          />
          {errors.kilogramo && <span className="text-red-500 text-sm">{errors.kilogramo}</span>}
        </Label>

        <Label className="mt-4">
          <span>Fecha de vencimiento</span>
          <Input
            type="date"
            name="fechavencimiento"
            value={formData.fechavencimiento}
            onChange={handleChange}
            className="mt-1"
          />
          {errors.fechavencimiento && <span className="text-red-500 text-sm">{errors.fechavencimiento}</span>}
        </Label>

        <Label className="mt-4">
          <span>Foto</span>
          <Input
            type="file"
            name="foto"
            onChange={handleChange}
            className="mt-1"
          />
          {errors.foto && <span className="text-red-500 text-sm">{errors.foto}</span>}
        </Label>

        <Label className="mt-4">
          <span>Tipo</span>
          <Select
            name="idTipo"
            value={formData.idTipo}
            onChange={handleChange}
            className="mt-1"
          >
            <option value="">Seleccione</option>
            {tipos.map((tipo) => (
              <option key={tipo.id} value={tipo.id}>{tipo.nombre}</option>
            ))}
          </Select>
          {errors.idTipo && <span className="text-red-500 text-sm">{errors.idTipo}</span>}
        </Label>

        <Label className="mt-4">
          <span>Marca</span>
          <Select
            name="idMarca"
            value={formData.idMarca}
            onChange={handleChange}
            className="mt-1"
          >
            <option value="">Seleccione</option>
            {marcas.map((marca) => (
              <option key={marca.id} value={marca.id}>{marca.nombre}</option>
            ))}
          </Select>
          {errors.idMarca && <span className="text-red-500 text-sm">{errors.idMarca}</span>}
        </Label>

        {message && (
          <div className={`mt-4 p-2 rounded-md ${messageType === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {message}
          </div>
        )}
      </div>

      <div className="flex justify-end gap-4 mt-6">
        <Button layout="outline" onClick={closeModal} disabled={isSubmitting}>Cancelar</Button>
        <Button layout="primary" onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? 'Registrando...' : 'Aceptar'}
        </Button>
      </div>
    </>
  );
}

export default ProductoRegistro;
