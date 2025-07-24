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
import PersonaRegistro from '../components/formularios/registro/PersonaRegistro';
import PersonaModificar from '../components/formularios/modificar/PersonaModificar';
import BotonReportePersonas from '../components/reporte/PersonaReporte';

function Persona() {
  const [lista, setLista] = useState([]); // Lista general (personas)
  const [pagina, setPagina] = useState(1);
  const [cantidadPorPagina] = useState(10);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [tipoMensaje, setTipoMensaje] = useState('');
  const [personaSeleccionada, setPersonaSeleccionada] = useState(null); // Persona seleccionada para modificación
  const [modalConfirmacionVisible, setModalConfirmacionVisible] = useState(false);
  const [personaAEliminar, setPersonaAEliminar] = useState(null); // Persona a eliminar
  const [modalModificarVisible, setModalModificarVisible] = useState(false);

  // Obtener todas las personas
  const obtenerElementos = async () => {
    try {
      const response = await api.get('/api/personas');
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
  const eliminarPersona = async (personaAEliminar) => {
    try {
      console.log('id de la perosna', personaAEliminar)
      const response = await api.delete(`/api/personas/eliminar/${personaAEliminar}`);
      if (response.status === 200) {
        setMensaje('Persona eliminada con éxito');
        setTipoMensaje('success');
        obtenerElementos();
        setModalConfirmacionVisible(false); // Cierra el modal de confirmación
      } else {
        setMensaje('Error al eliminar persona');
        setTipoMensaje('error');
      }
    } catch (error) {
      setMensaje('Error al eliminar persona');
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
  setPersonaSeleccionada(id);
  setModalModificarVisible(true); // Usar estado específico
};

const cerrarModalModificar = () => {
  setModalModificarVisible(false);
  setPersonaSeleccionada(null);
};

  return (
    <>
      <PageTitle>Persona</PageTitle>

      <div className="flex gap-4 mb-4">
        <Button onClick={() => setModalAbierto(true)}>Registrar</Button>
        <BotonReportePersonas />
      </div>

      <SectionTitle className="mt-4">Personas registradas</SectionTitle>

      <TableContainer className="mb-8">
        <Table>
          <TableHeader>
            <tr>
              <TableCell>Cédula</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Apellido</TableCell>
              <TableCell>Cargo</TableCell>
              <TableCell>Acciones</TableCell>
            </tr>
          </TableHeader>
          <TableBody>
            {elementosActuales.map((item) => (
              <TableRow key={item.idPersona}>
                <TableCell>{item.cedula}</TableCell>
                <TableCell>{item.nombrePersona}</TableCell>
                <TableCell>{item.apellido}</TableCell>
                <TableCell>{item.nombreCargo}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-4">
                    <Button
                      layout="link"
                      size="icon"
                      aria-label="Editar"
                      onClick={() => abrirModalModificar(item.idPersona)}
                    >
                      <EditIcon className="w-5 h-5" aria-hidden="true" />
                    </Button>
                    <Button
                      layout="link"
                      size="icon"
                      aria-label="Eliminar"
                      onClick={() => {
                        setPersonaAEliminar(item.idPersona); // Establecer la persona a eliminar
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
            onClick={() => eliminarPersona(personaAEliminar)} // Eliminar la persona seleccionada
          >
            Aceptar
          </Button>
        </ModalFooter>
      </Modal>

      {/* Modal para el formulario de registro */}
      <Modal isOpen={modalAbierto} onClose={() => setModalAbierto(false)}>
        <ModalBody>
          <PersonaRegistro
            closeModal={() => setModalAbierto(false)}
            onRegistroExitoso={manejarRegistroExitoso}
            persona={personaSeleccionada} // Pasar la persona seleccionada para editar
          />
        </ModalBody>
      </Modal>
          {/* Modal para modificar */}
    <Modal isOpen={modalModificarVisible} onClose={cerrarModalModificar}>
        <ModalHeader>Modificar Persona</ModalHeader>
        <ModalBody>
          <PersonaModificar 
            personaId={personaSeleccionada}
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

export default Persona;
