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
import TipoRegistro from '../components/formularios/registro/TipoRegistro';
import TipoModificar from '../components/formularios/modificar/TipoModificar';

function Tipo() {
  const [lista, setLista] = useState([]); // Lista general (tipos)
  const [pagina, setPagina] = useState(1);
  const [cantidadPorPagina] = useState(10);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [tipoMensaje, setTipoMensaje] = useState('');
  const [TipoSeleccionado, setTipoSeleccionado] = useState(null); // tipo seleccionado para modificación
  const [modalConfirmacionVisible, setModalConfirmacionVisible] = useState(false);
  const [TipoAEliminar, setTipoAEliminar] = useState(null); //  eliminar
  const [modalModificarVisible, setModalModificarVisible] = useState(false);

  // Obtener todos los elementos 
  const obtenerElementos = async () => {
    try {
      const response = await api.get('/api/tipos');
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
  const eliminarTipo = async (id) => {
    try {
      const response = await api.delete(`/api/tipos/eliminar/${id}`);
      if (response.status === 200) {
        setMensaje('Tipo eliminada con éxito');
        setTipoMensaje('success');
        obtenerElementos();
        setModalConfirmacionVisible(false); // Cierra el modal de confirmación
      } else {
        setMensaje('Error al eliminar tipo');
        setTipoMensaje('error');
      }
    } catch (error) {
      setMensaje('Error al eliminar tipo');
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
// Función para abrir el modal y pasar el ID del cargo seleccionado
const abrirModalModificar = (id) => {
  console.log("Iddddddddd selecionado", id)
  setTipoSeleccionado(id);
  setModalModificarVisible(true); // Usar estado específico
};

const cerrarModalModificar = () => {
  setModalModificarVisible(false);
  setTipoSeleccionado(null);

};
  return (
    <>
      <PageTitle>Tipo</PageTitle>

      <div className='mb-4'>
        <Button onClick={() => setModalAbierto(true)}>Registrar</Button>
      </div>

      <SectionTitle className="mt-4">Tipos registrados</SectionTitle>

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
                        setTipoAEliminar(item.id); // Establecer el que se va a eliminar
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
            onClick={() => eliminarTipo(TipoAEliminar)} // Eliminar el seleccionado
          >
            Aceptar
          </Button>
        </ModalFooter>
      </Modal>

      {/* Modal para el formulario de registro*/}
      <Modal isOpen={modalAbierto} onClose={() => setModalAbierto(false)}>
        <ModalBody>
          <TipoRegistro
            closeModal={() => setModalAbierto(false)}
            onRegistroExitoso={manejarRegistroExitoso}
            tipo={TipoSeleccionado} // Pasar el seleccionado para editar
          />
        </ModalBody>
      </Modal>
           {/* Modal para modificar */}
           <Modal isOpen={modalModificarVisible} onClose={cerrarModalModificar}>
        <ModalHeader>Modificar Tipo</ModalHeader>
        <ModalBody>
          <TipoModificar 
            tipoId={TipoSeleccionado}
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

export default Tipo;
