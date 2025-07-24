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
  ModalFooter, ModalHeader,
} from '@windmill/react-ui';
import { EditIcon, TrashIcon } from '../icons';
import CargoRegistro from '../components/formularios/registro/CargoRegistro';
import CargoModificar from '../components/formularios/modificar/CargoModificar';

function Cargo() {
  const [lista, setLista] = useState([]);
  const [pagina, setPagina] = useState(1);
  const [cantidadPorPagina] = useState(10);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [tipoMensaje, setTipoMensaje] = useState('');
  const [cargoSeleccionado, setCargoSeleccionado] = useState(null);
  const [modalConfirmacionVisible, setModalConfirmacionVisible] = useState(false);
  const [cargoAEliminar, setCargoAEliminar] = useState(null);
  const [modalModificarVisible, setModalModificarVisible] = useState(false);

  const obtenerElementos = async () => {
    try {
      const response = await api.get('/api/cargos');
      const datos = response.data.reverse();
      setLista(datos);
    } catch (error) {
      console.error('Error al obtener los elementos:', error);
      setMensaje('Error al obtener los elementos');
      setTipoMensaje('error');
    }
  };

  useEffect(() => {
    obtenerElementos();
  }, []);

  const manejarRegistroExitoso = () => {
    obtenerElementos();
    setMensaje('Registro exitoso');
    setTipoMensaje('success');
    setTimeout(() => {
      setMensaje('');
      setTipoMensaje('');
    }, 3000);
  };

  const handleModificacionExitosa = () => {
    setMensaje('Modificación exitosa');
    setTipoMensaje('success');
    obtenerElementos();
    setTimeout(() => {
      setMensaje('');
      setTipoMensaje('');
    }, 3000);
  };

  const eliminarCargo = async (cargoAEliminar) => {
    try {
      const response = await api.delete(`/api/cargos/eliminar/${cargoAEliminar}`);
      if (response.status === 200) {
        setMensaje('Cargo eliminado con éxito');
        setTipoMensaje('success');
        obtenerElementos();
        setModalConfirmacionVisible(false);
      } else {
        setMensaje('Error al eliminar cargo');
        setTipoMensaje('error');
      }
    } catch (error) {
      setMensaje('Error al eliminar cargo');
      setTipoMensaje('error');
      console.error('Error al eliminar:', error);
    }
  };

  const totalElementos = lista.length;
  const indiceFinal = pagina * cantidadPorPagina;
  const indiceInicial = indiceFinal - cantidadPorPagina;
  const elementosActuales = lista.slice(indiceInicial, indiceFinal);

  const abrirModalModificar = (id) => {
    setCargoSeleccionado(id);
    setModalModificarVisible(true);
  };

  const cerrarModalModificar = () => {
    setModalModificarVisible(false);
    setCargoSeleccionado(null);
  };

  return (
    <>
      <PageTitle>Cargo</PageTitle>

      <div className='mb-4'>
        <Button onClick={() => setModalAbierto(true)}>Registrar</Button>
      </div>

      <SectionTitle className="mt-4">Cargos registrados</SectionTitle>

      <TableContainer className="mb-8">
        <Table>
          <TableHeader>
            <tr>
              <TableCell>Nombre</TableCell>
              <TableCell>Acciones</TableCell>
            </tr>
          </TableHeader>
          <TableBody>
            {elementosActuales.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.nombre}</TableCell>
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
                        setCargoAEliminar(item.id);
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
          ¿Está seguro de eliminar este registro permanentemente?
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => setModalConfirmacionVisible(false)}>
            Cancelar
          </Button>
          <Button
            color="danger"
            onClick={() => eliminarCargo(cargoAEliminar)}
          >
            Aceptar
          </Button>
        </ModalFooter>
      </Modal>

      {/* Modal para el formulario de registro */}
      <Modal isOpen={modalAbierto} onClose={() => setModalAbierto(false)}>
        <ModalBody>
        <CargoRegistro
          onCloseModal={() => setModalAbierto(false)}
          onRegistroExitoso={() => {
            manejarRegistroExitoso();
            setTimeout(() => setModalAbierto(false), 1500); 
          }}
        />
        </ModalBody>
      </Modal>

      {/* Modal para modificar */}
      <Modal isOpen={modalModificarVisible} onClose={cerrarModalModificar}>
        <ModalHeader>Modificar Cargo</ModalHeader>
        <ModalBody>
          <CargoModificar
            cargoId={cargoSeleccionado}
            onCloseModal={cerrarModalModificar}
            onModificarExitoso={() => {
              handleModificacionExitosa();
              cerrarModalModificar();
            }}
          />
        </ModalBody>
      </Modal>
    </>
  );
}

export default Cargo;
