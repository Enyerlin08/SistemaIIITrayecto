import React, { useState, useEffect } from 'react';
import PageTitle from '../../../components/Typography/PageTitle';
import {
  Button,
  Label,
  Input,
  Textarea,
  Select,
} from '@windmill/react-ui';
import axios from '../../../servicio/api';

function PlatoRegistro({ closeModal, onRegistroExitoso }) {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    ingredientes: [{ id_producto: '', cantidad: 0 }],
  });
  const [productos, setProductos] = useState([]);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await axios.get('/platos/productos-disponibles');
        const activos = response.data.filter(
          (p) => !p.fechavencimiento || new Date(p.fechavencimiento) >= new Date()
        );
        setProductos(activos);
      } catch (error) {
        setMessage('Error al cargar los productos disponibles');
        setMessageType('danger');
      }
    };
    fetchProductos();
  }, []);

  const handleChange = (e, index = null) => {
    const { name, value } = e.target;

    if (name === 'nombre' || name === 'descripcion') {
      setFormData({ ...formData, [name]: value });
      setErrors((prev) => ({ ...prev, [name]: '' }));
    } else if (name === 'id_producto' || name === 'cantidad') {
      const newIngredientes = [...formData.ingredientes];
      const val = name === 'cantidad' ? parseFloat(value) || 0 : value;
      newIngredientes[index][name] = val;
      setFormData({ ...formData, ingredientes: newIngredientes });

      const newErrors = { ...errors };
      if (name === 'id_producto') {
        const ids = newIngredientes.map((i) => i.id_producto);
        if (!val) {
          newErrors[`id_producto_${index}`] = 'Seleccione un producto';
        } else if (ids.filter((id) => id === val).length > 1) {
          newErrors[`id_producto_${index}`] = 'Este producto ya está seleccionado';
        } else {
          delete newErrors[`id_producto_${index}`];
        }
      } else if (name === 'cantidad') {
        if (val <= 0 || isNaN(val)) {
          newErrors[`cantidad_${index}`] = 'Debe ser un número mayor a 0';
        } else {
          const producto = productos.find(
            (p) => p.id === parseInt(newIngredientes[index].id_producto)
          );
          if (producto && producto.kilogramo && val > producto.kilogramo) {
            newErrors[`cantidad_${index}`] = `Máximo permitido: ${producto.kilogramo} kg`;
          } else {
            delete newErrors[`cantidad_${index}`];
          }
        }
      }
      setErrors(newErrors);
    }
  };

  const addIngrediente = () => {
    setFormData({
      ...formData,
      ingredientes: [...formData.ingredientes, { id_producto: '', cantidad: 0 }],
    });
  };

  const removeIngrediente = (index) => {
    const newIngredientes = formData.ingredientes.filter((_, i) => i !== index);
    setFormData({ ...formData, ingredientes: newIngredientes });

    const newErrors = { ...errors };
    delete newErrors[`id_producto_${index}`];
    delete newErrors[`cantidad_${index}`];
    setErrors(newErrors);
  };

  const validarForm = () => {
    const formErrors = {};

    if (!formData.nombre.trim()) {
      formErrors.nombre = 'El nombre del plato es requerido';
    } else if (!/^[A-Za-záéíóúñÁÉÍÓÚÑ\s]+$/.test(formData.nombre)) {
      formErrors.nombre = 'Solo se permiten letras, espacios y tildes';
    }

    const ids = formData.ingredientes.map((i) => i.id_producto);

    formData.ingredientes.forEach((ing, i) => {
      if (!ing.id_producto) {
        formErrors[`id_producto_${i}`] = 'Seleccione un producto';
      } else if (ids.filter((id) => id === ing.id_producto).length > 1) {
        formErrors[`id_producto_${i}`] = 'Este producto ya está repetido';
      }

      if (!ing.cantidad || ing.cantidad <= 0) {
        formErrors[`cantidad_${i}`] = 'Debe ser mayor a 0';
      } else {
        const producto = productos.find((p) => p.id === parseInt(ing.id_producto));
        if (producto && producto.kilogramo && ing.cantidad > producto.kilogramo) {
          formErrors[`cantidad_${i}`] = `Máximo: ${producto.kilogramo} kg`;
        }
      }
    });

    return formErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validarForm();
    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
      setIsSubmitting(true);
      try {
        const payload = {
          nombre: formData.nombre,
          descripcion: formData.descripcion || null,
          ingredientes: formData.ingredientes.map((i) => ({
            id_producto: parseInt(i.id_producto),
            cantidad: i.cantidad,
          })),
        };

        const res = await axios.post('/platos/registrar', payload);

        if (res.status === 201) {
          setMessage('Plato registrado con éxito');
          setMessageType('success');
          setFormData({
            nombre: '',
            descripcion: '',
            ingredientes: [{ id_producto: '', cantidad: 0 }],
          });
          setErrors({});
          if (onRegistroExitoso) onRegistroExitoso();
        }
      } catch (err) {
        setMessage('Error al registrar el plato');
        setMessageType('danger');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setMessage('Corrige los errores antes de continuar');
      setMessageType('danger');
    }
  };

  return (
    <>
      <PageTitle>Registrar Plato</PageTitle>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md dark:bg-gray-800">
        <Label>
          Nombre del Plato
          <Input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className="mt-1"
            placeholder="Ej: Arroz con Pollo"
          />
        </Label>
        {errors.nombre && <p className="text-red-500 text-sm">{errors.nombre}</p>}

        <Label className="mt-4">
          Descripción (opcional)
          <Textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            className="mt-1"
            placeholder="Descripción del plato"
          />
        </Label>

        <div className="mt-6">
          <Label>Ingredientes</Label>
          {formData.ingredientes.map((ing, index) => (
            <div key={index} className="flex items-center gap-4 mt-4">
              <div className="flex-1">
                <Select
                  name="id_producto"
                  value={ing.id_producto}
                  onChange={(e) => handleChange(e, index)}
                >
                  <option value="">Seleccione un producto</option>
                  {productos.map((prod) => (
                    <option key={prod.id} value={prod.id}>
                      {prod.nombre} ({prod.kilogramo} kg disponibles)
                    </option>
                  ))}
                </Select>
                {errors[`id_producto_${index}`] && (
                  <p className="text-red-500 text-sm">{errors[`id_producto_${index}`]}</p>
                )}
              </div>
              <div>
                <Input
                  type="number"
                  name="cantidad"
                  min="0"
                  step="0.01"
                  value={ing.cantidad}
                  onChange={(e) => handleChange(e, index)}
                  placeholder="Cantidad (kg)"
                />
                {errors[`cantidad_${index}`] && (
                  <p className="text-red-500 text-sm">{errors[`cantidad_${index}`]}</p>
                )}
              </div>
              {formData.ingredientes.length > 1 && (
                <Button layout="outline" onClick={() => removeIngrediente(index)} type="button">
                  Quitar
                </Button>
              )}
            </div>
          ))}
          <Button layout="link" className="mt-2" type="button" onClick={addIngrediente}>
            + Agregar Ingrediente
          </Button>
        </div>

        {message && (
          <p className={`mt-4 text-sm ${messageType === 'success' ? 'text-green-500' : 'text-red-500'}`}>
            {message}
          </p>
        )}

        <div className="mt-6 flex justify-end gap-4">
          <Button type="button" layout="outline" onClick={closeModal}>
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

export default PlatoRegistro;
