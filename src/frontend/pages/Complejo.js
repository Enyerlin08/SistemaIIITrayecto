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
} from '@windmill/react-ui';
import { EditIcon, TrashIcon } from '../icons';
import ComplejoRegistro from '../components/formularios/registro/ComplejoRegistro';

function Complejo() {
  const [lista, setLista] = useState([]); // Lista general (complejos educativos)
  const [pagina, setPagina] = useState(1);
  const [cantidadPorPagina] = useState(10);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [tipoMensaje, setTipoMensaje] = useState('');
  const [complejoSeleccionado, setComplejoSeleccionado] = useState(null); // Complejo seleccionado para modificación
  const [modalConfirmacionVisible, setModalConfirmacionVisible] = useState(false);
  const [complejoAEliminar, setComplejoAEliminar] = useState(null); // Complejo a eliminar

  // Obtener todos los complejos educativos
  const obtenerElementos = async () => {
    try {
      const response = await api.get('/api/complejos');
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
  const eliminarComplejo = async (complejoAEliminar) => {
    try {
      const response = await api.delete(`/api/complejos/eliminar/${complejoAEliminar}`);
      if (response.status === 200) {
        setMensaje('Complejo educativo eliminado con éxito');
        setTipoMensaje('success');
        obtenerElementos();
        setModalConfirmacionVisible(false); // Cierra el modal de confirmación
      } else {
        setMensaje('Error al eliminar complejo educativo');
        setTipoMensaje('error');
      }
    } catch (error) {
      setMensaje('Error al eliminar complejo educativo');
      setTipoMensaje('error');
      console.error('Error al eliminar:', error);
    }
  };

  // Paginación
  const totalElementos = lista.length;
  const indiceFinal = pagina * cantidadPorPagina;
  const indiceInicial = indiceFinal - cantidadPorPagina;
  const elementosActuales = lista.slice(indiceInicial, indiceFinal);

  return (
    <>
      <PageTitle>Complejo Educativo</PageTitle>

      <div className='mb-4'>
        <Button onClick={() => setModalAbierto(true)}>Registrar</Button>
      </div>

      <SectionTitle className="mt-4">Complejos Educativos Registrados</SectionTitle>

      <TableContainer className="mb-8">
        <Table>
          <TableHeader>
            <tr>
              <TableCell>Nombre</TableCell>
              <TableCell>Código</TableCell>
              <TableCell>Asistencia Estudiantes</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Acciones</TableCell>
            </tr>
          </TableHeader>
          <TableBody>
            {elementosActuales.map((item) => (
              <TableRow key={item.idComplejo}>
                <TableCell>{item.nombre}</TableCell>
                <TableCell>{item.codigo}</TableCell>
                <TableCell>{item.asistenciaestudiante}</TableCell>
                <TableCell>
                  {new Date(item.fecha).toLocaleDateString('es-VE', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                  })}
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-4">
                    <Button
                      layout="link"
                      size="icon"
                      aria-label="Editar"
                      onClick={() => {
                        setComplejoSeleccionado(item); // Establecer el complejo seleccionado para editar
                        setModalAbierto(true);
                      }}
                    >
                      <EditIcon className="w-5 h-5" aria-hidden="true" />
                    </Button>
                    <Button
                      layout="link"
                      size="icon"
                      aria-label="Eliminar"
                      onClick={() => {
                        setComplejoAEliminar(item.idComplejo); // Establecer el complejo a eliminar
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
            onClick={() => eliminarComplejo(complejoAEliminar)} // Eliminar el complejo seleccionado
          >
            Aceptar
          </Button>
        </ModalFooter>
      </Modal>

      {/* Modal para el formulario de registro */}
      <Modal isOpen={modalAbierto} onClose={() => setModalAbierto(false)}>
        <ModalBody>
          <ComplejoRegistro
            closeModal={() => setModalAbierto(false)}
            onRegistroExitoso={manejarRegistroExitoso}
            complejo={complejoSeleccionado} // Pasar el complejo seleccionado para editar
          />
        </ModalBody>
      </Modal>
    </>
  );
}

export default Complejo;