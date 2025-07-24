import React, { useEffect, useState } from 'react';
import { Button, Input, Label, Modal, ModalHeader, ModalBody, ModalFooter } from '@windmill/react-ui';
import axios from '../../../servicio/api';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import ComplejoRegistro from './ComplejoRegistro';

const ComplejoLista = () => {
  const [complejos, setComplejos] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [complejoSeleccionado, setComplejoSeleccionado] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmarEliminacion, setConfirmarEliminacion] = useState(false);

  const obtenerComplejos = async () => {
    try {
      const response = await axios.get(`/complejos?filtro=${filtro}`);
      setComplejos(response.data);
    } catch (error) {
      console.error('Error al obtener complejos:', error);
    }
  };

  useEffect(() => {
    obtenerComplejos();
  }, [filtro]);

  const handleEliminar = async () => {
    try {
      await axios.delete(`/complejos/eliminar/${complejoSeleccionado.id}`);
      setConfirmarEliminacion(false);
      setComplejoSeleccionado(null);
      obtenerComplejos();
    } catch (error) {
      console.error('Error al eliminar complejo:', error);
    }
  };

  const imprimirPDF = () => {
    const doc = new jsPDF();
    doc.text('Lista de Complejos Educativos', 20, 10);
    doc.autoTable({
      startY: 20,
      head: [['ID', 'Nombre', 'Código', 'Asistencia', 'Fecha']],
      body: complejos.map(c => [c.id, c.nombre, c.codigo, c.asistenciaestudiante, c.fecha]),
    });
    doc.save('complejos_educativos.pdf');
  };

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <Input
          className="w-1/3"
          placeholder="Buscar por nombre..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        />
        <div className="space-x-2">
          <Button onClick={() => setModalOpen(true)}>Registrar Complejo</Button>
          <Button onClick={imprimirPDF}>Imprimir</Button>
        </div>
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-700">
            <th>ID</th>
            <th>Nombre</th>
            <th>Código</th>
            <th>Asistencia</th>
            <th>Fecha</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {complejos.map((c) => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.nombre}</td>
              <td>{c.codigo}</td>
              <td>{c.asistenciaestudiante}</td>
              <td>{c.fecha}</td>
              <td className="space-x-2">
                <Button size="small" onClick={() => { setComplejoSeleccionado(c); setModalOpen(true); }}>
                  Editar
                </Button>
                <Button size="small" layout="outline" onClick={() => { setComplejoSeleccionado(c); setConfirmarEliminacion(true); }}>
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal de Registro/Edición */}
      {modalOpen && (
        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
          <ModalHeader>{complejoSeleccionado ? 'Editar Complejo' : 'Registrar Complejo'}</ModalHeader>
          <ModalBody>
            <ComplejoRegistro
              complejo={complejoSeleccionado}
              onRegistroExitoso={() => {
                obtenerComplejos();
                setModalOpen(false);
                setComplejoSeleccionado(null);
              }}
              closeModal={() => {
                setModalOpen(false);
                setComplejoSeleccionado(null);
              }}
            />
          </ModalBody>
        </Modal>
      )}

      {/* Modal de Confirmación de Eliminación */}
      {confirmarEliminacion && (
        <Modal isOpen={confirmarEliminacion} onClose={() => setConfirmarEliminacion(false)}>
          <ModalHeader>¿Estás seguro?</ModalHeader>
          <ModalBody>
            Esta acción eliminará el complejo: <strong>{complejoSeleccionado?.nombre}</strong>
          </ModalBody>
          <ModalFooter>
            <Button onClick={handleEliminar}>Sí, eliminar</Button>
            <Button layout="outline" onClick={() => setConfirmarEliminacion(false)}>Cancelar</Button>
          </ModalFooter>
        </Modal>
      )}
    </div>
  );
};

export default ComplejoLista;
