import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "../servicio/api";

const CargoRegistro = ({ onCloseModal, onRegistroExitoso }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const onSubmit = async (data) => {
    try {
      // Enviamos solo el nombre (el status 'A' se asigna automáticamente en el backend)
      const response = await axios.post("/cargos/registrar", { 
        nombre: data.nombre 
      });

      if (response.status === 201) {
        setMessage("Cargo registrado con éxito");
        setMessageType("success");
        reset(); // Limpiar el formulario
        if (onRegistroExitoso) onRegistroExitoso();
        if (onCloseModal) onCloseModal();
      }
    } catch (error) {
      setMessage("Error al registrar el cargo");
      setMessageType("danger");
      console.error("Error al registrar:", error.response?.data || error.message);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Registrar Nuevo Cargo</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nombre del Cargo
          </label>
          <input
            type="text"
            {...register("nombre", { 
              required: "Este campo es obligatorio",
              pattern: {
                value: /^[A-Za-záéíóúñÁÉÍÓÚÑ\s]+$/,
                message: "Solo se permiten letras y espacios"
              },
              maxLength: {
                value: 100,
                message: "Máximo 100 caracteres"
              }
            })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.nombre && (
            <p className="mt-1 text-sm text-red-600">{errors.nombre.message}</p>
          )}
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCloseModal}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Guardar
          </button>
        </div>
      </form>

      {message && (
        <div className={`mt-4 p-3 rounded-md ${
          messageType === "success" 
            ? "bg-green-100 text-green-800" 
            : "bg-red-100 text-red-800"
        }`}>
          {message}
        </div>
      )}
    </div>
  );
};

export default CargoRegistro;