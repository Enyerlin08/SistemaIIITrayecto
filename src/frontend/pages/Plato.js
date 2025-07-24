import React, { useState, useEffect } from 'react';
import api from '../servicio/axio';
import PageTitle from '../components/Typography/PageTitle';
import SectionTitle from '../components/Typography/SectionTitle';
import {
  Table,
  TableHeader,
  TableCell,
  TableBody,
  TableRow,
  TableFooter,
  TableContainer,
  Button,
  Pagination,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from '@windmill/react-ui';
import { EditIcon, TrashIcon } from '../icons';
import PlatoRegistro from '../components/formularios/registro/platoRegistro';
import PlatoModificar from '../components/formularios/modificar/PlatoModificar';

function Plato() {
  const [lista, setLista] = useState([]);
  const [pagina, setPagina] = useState(1);
  const [cantidadPorPagina] = useState(10);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [tipoMensaje, setTipoMensaje] = useState('');
  const [platoSeleccionado, setPlatoSeleccionado] = useState(null);
  const [modalConfirmacionVisible, setModalConfirmacionVisible] = useState(false);
  const [platoAEliminar, setPlatoAEliminar] = useState(null);
  const [modalModificarVisible, setModalModificarVisible] = useState(false);

  const obtenerPlatos = async () => {
    try {
      const response = await api.get('/api/platos');
      const datos = response.data.reverse();
      setLista(datos);
    } catch (error) {
      console.error('Error al obtener los platos:', error);
      setMensaje('Error al obtener los platos');
      setTipoMensaje('error');
    }
  };

  useEffect(() => {
    obtenerPlatos();
  }, []);

  const manejarRegistroExitoso = () => {
    obtenerPlatos();
    setMensaje('Plato registrado con éxito');
    setTipoMensaje('success');
    setTimeout(() => {
      setMensaje('');
      setTipoMensaje('');
    }, 3000);
  };

  const manejarModificacionExitosa = () => {
    setMensaje('Plato modificado con éxito');
    setTipoMensaje('success');
    obtenerPlatos();
    setTimeout(() => {
      setMensaje('');
      setTipoMensaje('');
    }, 3000);
  };

  const eliminarPlato = async (platoAEliminar) => {
    try {
      const response = await api.delete(`/api/platos/eliminar/${platoAEliminar}`);
      if (response.status === 200) {
        setMensaje('Plato eliminado con éxito');
        setTipoMensaje('success');
        obtenerPlatos();
        setModalConfirmacionVisible(false);
      } else {
        setMensaje('Error al eliminar el plato');
        setTipoMensaje('error');
      }
    } catch (error) {
      setMensaje('Error al eliminar el plato');
      setTipoMensaje('error');
      console.error('Error al eliminar:', error);
    }
  };

  const totalElementos = lista.length;
  const indiceFinal = pagina * cantidadPorPagina;
  const indiceInicial = indiceFinal - cantidadPorPagina;
  const elementosActuales = lista.slice(indiceInicial, indiceFinal);

  const abrirModalModificar = (id) => {
    setPlatoSeleccionado(id);
    setModalModificarVisible(true);
  };

  const cerrarModalModificar = () => {
    setModalModificarVisible(false);
    setPlatoSeleccionado(null);
  };

  return (
    <>
      <PageTitle>Platos</PageTitle>

      <div className='mb-4'>
        <Button onClick={() => setModalAbierto(true)}>Registrar Plato</Button>
      </div>

      <SectionTitle className="mt-4">Platos Registrados</SectionTitle>

      <TableContainer className="mb-8">
        <Table>
          <TableHeader>
            <tr>
              <TableCell>Nombre</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Ingredientes</TableCell>
              <TableCell>Acciones</TableCell>
            </tr>
          </TableHeader>
          <TableBody>
            {elementosActuales.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.nombre}</TableCell>
                <TableCell>{item.descripcion || 'Sin descripción'}</TableCell>
                <TableCell>
                  {item.ingredientes.length > 0
                    ? item.ingredientes.map(ing => `${ing.nombre_producto}: ${ing.cantidad} kg`).join(', ')
                    : 'Sin ingredientes'}
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-4">
                    <Button
                      layout="link"
                      size="icon"
                      aria-label="Editar"
                      onClick={() => abrirModalModificar(item.id)}
                    >
                      <EditIcon className="w-5 h-5" aria-hidden="true" />
                    </Button>
                    <Button
                      layout="link"
                      size="icon"
                      aria-label="Eliminar"
                      onClick={() => {
                        setPlatoAEliminar(item.id);
                        setModalConfirmacionVisible(true);
                      }}
                    >
                      <TrashIcon className="w-5 h-5" aria-hidden="true" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <TableFooter>
          <Pagination
            totalResults={totalElementos}
            resultsPerPage={cantidadPorPagina}
            onChange={setPagina}
            label="Navegación de tabla"
            className="flex justify-center mx-auto"
          />
        </TableFooter>
      </TableContainer>

      <Modal isOpen={modalConfirmacionVisible} onClose={() => setModalConfirmacionVisible(false)}>
        <ModalBody>
          ¿Está seguro de eliminar este plato permanentemente?
        </ModalBody>
        <ModalFooter>
          <Button layout="outline" onClick={() => setModalConfirmacionVisible(false)}>
            Cancelar
          </Button>
          <Button
            layout="primary"
            onClick={() => eliminarPlato(platoAEliminar)}
          >
            Aceptar
          </Button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalAbierto} onClose={() => setModalAbierto(false)}>
        <ModalBody>
          <PlatoRegistro
            closeModal={() => setModalAbierto(false)}
            onRegistroExitoso={() => {
              manejarRegistroExitoso();
              setTimeout(() => setModalAbierto(false), 1500);
            }}
          />
        </ModalBody>
      </Modal>

      <Modal isOpen={modalModificarVisible} onClose={cerrarModalModificar}>
        <ModalHeader>Modificar Plato</ModalHeader>
        <ModalBody>
          <PlatoModificar
            platoId={platoSeleccionado}
            closeModal={cerrarModalModificar}
            onModificarExitoso={() => {
              manejarModificacionExitosa();
              cerrarModalModificar();
            }}
          />
        </ModalBody>
      </Modal>

      {mensaje && (
        <div
          className={`fixed bottom-4 right-4 p-4 rounded-md ${
            tipoMensaje === 'success'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {mensaje}
        </div>
      )}
    </>
  );
}

export default Plato;