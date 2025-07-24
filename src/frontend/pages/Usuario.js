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
import UsuarioRegistro from '../components/formularios/registro/UsuarioRegistro';

function Usuario() {
  const [lista, setLista] = useState([]);
  const [pagina, setPagina] = useState(1);
  const [cantidadPorPagina] = useState(10);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [tipoMensaje, setTipoMensaje] = useState('');
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [modalConfirmacionVisible, setModalConfirmacionVisible] = useState(false);
  const [usuarioAEliminar, setUsuarioAEliminar] = useState(null);

  const obtenerElementos = async () => {
    try {
      const response = await api.get('/api/usuarios');
      const datos = response.data.reverse();
      setLista(datos);
    } catch (error) {
      console.error('Error al obtener los usuarios:', error);
      setMensaje('Error al obtener los usuarios');
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

  const eliminarUsuario = async (id) => {
    try {
      const response = await api.delete(`/api/usuario/${id}`);
      if (response.status === 200) {
        setMensaje('Usuario eliminado con éxito');
        setTipoMensaje('success');
        obtenerElementos();
        setModalConfirmacionVisible(false);
      } else {
        setMensaje('Error al eliminar usuario');
        setTipoMensaje('error');
      }
    } catch (error) {
      setMensaje('Error al eliminar usuario');
      setTipoMensaje('error');
      console.error('Error al eliminar:', error);
    }
  };

  const totalElementos = lista.length;
  const indiceFinal = pagina * cantidadPorPagina;
  const indiceInicial = indiceFinal - cantidadPorPagina;
  const elementosActuales = lista.slice(indiceInicial, indiceFinal);

  return (
    <>
      <PageTitle>Usuario</PageTitle>

      <div className='mb-4'>
        <Button
          onClick={() => {
            setUsuarioSeleccionado(null);
            setModalAbierto(true);
          }}
        >
          Registrar
        </Button>
      </div>

      <SectionTitle className="mt-4">Usuarios Registrados</SectionTitle>

      <TableContainer className="mb-8">
        <Table>
          <TableHeader>
            <tr>
              <TableCell>Nombre de Usuario</TableCell>
              <TableCell>Tipo de Usuario</TableCell>
              <TableCell>Persona</TableCell>
              <TableCell>Acciones</TableCell>
            </tr>
          </TableHeader>
          <TableBody>
            {elementosActuales.map((item) => (
              <TableRow key={item.id || item.idUsuario}>
                <TableCell>{item.nombreUsuario}</TableCell>
                <TableCell>{item.tipousuario}</TableCell>
                <TableCell>{item.nombrePersona} {item.apellido}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-4">
                    <Button
                      layout="link"
                      size="icon"
                      aria-label="Editar"
                      onClick={() => {
                        setUsuarioSeleccionado(item.id || item.idUsuario);
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
                        setUsuarioAEliminar(item.id || item.idUsuario);
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
          <Button color="danger" onClick={() => eliminarUsuario(usuarioAEliminar)}>
            Aceptar
          </Button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalAbierto} onClose={() => setModalAbierto(false)}>
        <ModalBody>
          <UsuarioRegistro
            closeModal={() => setModalAbierto(false)}
            onRegistroExitoso={manejarRegistroExitoso}
            Usuario={usuarioSeleccionado}
          />
        </ModalBody>
      </Modal>
    </>
  );
}

export default Usuario;
