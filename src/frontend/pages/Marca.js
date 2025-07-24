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
import MarcaRegistro from '../components/formularios/registro/MarcaRegistro';
import MarcaModificar from '../components/formularios/modificar/MarcaModificar';

function Marca() {
  const [lista, setLista] = useState([]); // Lista general (marcas)
  const [pagina, setPagina] = useState(1);
  const [cantidadPorPagina] = useState(10);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [tipoMensaje, setTipoMensaje] = useState('');
  const [marcaSeleccionada, setMarcaSeleccionada] = useState(null); // marca seleccionado para modificación
  const [modalConfirmacionVisible, setModalConfirmacionVisible] = useState(false);
  const [marcaAEliminar, setMarcaAEliminar] = useState(null); //  eliminar
  const [modalModificarVisible, setModalModificarVisible] = useState(false);

  // Obtener todos los elementos 
  const obtenerElementos = async () => {
    try {
      const response = await api.get('/api/marcas');
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

  const manejarRegistroExitoso = (mensaje = 'Registro exitoso', tipo = 'success') => {
    setMensaje(mensaje);
    setTipoMensaje(tipo);
    obtenerElementos();
    setTimeout(() => {
      setMensaje('');
      setTipoMensaje('');
    }, 3000);
  };

  // Función de eliminación
  const eliminarMarca = async (marcaAEliminar) => {
    try {
      const response = await api.delete(`/api/marcas/eliminar/${marcaAEliminar}`);
      if (response.status === 200) {
        setMensaje('Marca eliminada con éxito');
        setTipoMensaje('success');
        obtenerElementos();
        setModalConfirmacionVisible(false); // Cierra el modal de confirmación
      } else {
        setMensaje('Error al eliminar marca');
        setTipoMensaje('error');
      }
    } catch (error) {
      setMensaje('Error al eliminar marca');
      setTipoMensaje('error');
      console.error('Error al eliminar:', error);
    }
  };
  //funcion de mensaje exitoso al modificar
  const handleModificacionExitosa = (mensaje = 'Modificación exitosa', tipo = 'success') => {
    setMensaje(mensaje);
    setTipoMensaje(tipo);
    obtenerElementos(); // Actualiza la lista 
    setTimeout(() => {
      setMensaje('');
      setTipoMensaje('');
    }, 3000); // Limpia el mensaje después de 3 segundos
  };
  // Paginación
  const totalElementos = lista.length;
  const indiceFinal = pagina * cantidadPorPagina;
  const indiceInicial = indiceFinal - cantidadPorPagina;
  const elementosActuales = lista.slice(indiceInicial, indiceFinal);
// Función para abrir el modal y pasar el  seleccionado
const abrirModalModificar = (id) => {
  console.log("Iddddddddd selecionado", id)
  setMarcaSeleccionada(id);
  setModalModificarVisible(true); // Usar estado específico
};

const cerrarModalModificar = () => {
  setModalModificarVisible(false);
  setMarcaSeleccionada(null);
};
  return (
    <>
      <PageTitle>Marca</PageTitle>

      <div className='mb-4'>
        <Button onClick={() => setModalAbierto(true)}>Registrar</Button>
      </div>

      <SectionTitle className="mt-4">Marcas registrados</SectionTitle>

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
                        setMarcaAEliminar(item.id); // Establecer el que se va a eliminar
                        setModalConfirmacionVisible(true); // Abrir el modal de confirmación
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

      {/* Modal de Confirmación de Eliminación */}
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
            onClick={() => eliminarMarca(marcaAEliminar)} // Eliminar el seleccionado
          >
            Aceptar
          </Button>
        </ModalFooter>
      </Modal>

      {/* Modal para el formulario de registro*/}
      <Modal isOpen={modalAbierto} onClose={() => setModalAbierto(false)}>
        <ModalBody>
          <MarcaRegistro
            closeModal={() => setModalAbierto(false)}
            onRegistroExitoso={manejarRegistroExitoso}
            marca={marcaSeleccionada} // Pasar el seleccionado para editar
          />
        </ModalBody>
      </Modal>
    {/* Modal para modificar */}
    <Modal isOpen={modalModificarVisible} onClose={cerrarModalModificar}>
        <ModalHeader>Modificar Marca</ModalHeader>
        <ModalBody>
          <MarcaModificar 
            marcaId={marcaSeleccionada}
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

export default Marca;
