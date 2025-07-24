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
import ProductoRegistro from '../components/formularios/registro/ProductoRegistro';

function Producto() {
  const [lista, setLista] = useState([]);
  const [pagina, setPagina] = useState(1);
  const [cantidadPorPagina] = useState(10);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [tipoMensaje, setTipoMensaje] = useState('');
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [modalConfirmacionVisible, setModalConfirmacionVisible] = useState(false);
  const [productoAEliminar, setProductoAEliminar] = useState(null);

  // Modal para foto ampliada
  const [modalFotoAbierto, setModalFotoAbierto] = useState(false);
  const [fotoSeleccionada, setFotoSeleccionada] = useState(null);

  const obtenerElementos = async () => {
    try {
      const response = await api.get('/api/productos');
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

  const eliminarProducto = async (productoAEliminar) => {
    try {
      const response = await api.delete(`/api/productos/eliminar/${productoAEliminar}`);
      if (response.status === 200) {
        setMensaje('Producto eliminado con éxito');
        setTipoMensaje('success');
        obtenerElementos();
        setModalConfirmacionVisible(false);
      } else {
        setMensaje('Error al eliminar');
        setTipoMensaje('error');
      }
    } catch (error) {
      setMensaje('Error al eliminar');
      setTipoMensaje('error');
      console.error('Error al eliminar:', error);
    }
  };

  const abrirModalFoto = (fotoNombreArchivo) => {
    // Construimos la URL completa para la imagen
    const urlFoto = `http://localhost:3000/uploads/${fotoNombreArchivo}`;
    setFotoSeleccionada(urlFoto);
    setModalFotoAbierto(true);
  };

  // Paginación
  const totalElementos = lista.length;
  const indiceFinal = pagina * cantidadPorPagina;
  const indiceInicial = indiceFinal - cantidadPorPagina;
  const elementosActuales = lista.slice(indiceInicial, indiceFinal);

  return (
    <>
      <PageTitle>Producto</PageTitle>

      <div className="mb-4">
        <Button
          onClick={() => {
            setProductoSeleccionado(null);
            setModalAbierto(true);
          }}
        >
          Registrar
        </Button>
      </div>

      <SectionTitle className="mt-4">Productos Registrados</SectionTitle>

      <TableContainer className="mb-8">
        <Table>
          <TableHeader>
            <tr>
              <TableCell>Nombre</TableCell>
              <TableCell>Marca</TableCell>
              <TableCell>Kilogramos</TableCell>
              <TableCell>Fecha de vencimiento</TableCell>
              <TableCell>Foto</TableCell>
              <TableCell>Acciones</TableCell>
            </tr>
          </TableHeader>
          <TableBody>
            {elementosActuales.map((item) => {
              const urlFoto = item.foto ? `http://localhost:3000/uploads/${item.foto}` : null;
              return (
                <TableRow key={item.idProducto}>
                  <TableCell>{item.nombreProducto}</TableCell>
                  <TableCell>{item.nombreMarca}</TableCell>
                  <TableCell>{item.kilogramo}</TableCell>
                  <TableCell>
                    {new Date(item.fechavencimiento).toLocaleDateString('es-VE', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    })}
                  </TableCell>
                  <TableCell>
                    {urlFoto ? (
                      <img
                        src={urlFoto}
                        alt={`Foto de ${item.nombreProducto}`}
                        style={{
                          width: 50,
                          height: 50,
                          objectFit: 'cover',
                          cursor: 'pointer',
                          borderRadius: 4,
                        }}
                        onClick={() => abrirModalFoto(item.foto)}
                      />
                    ) : (
                      'No hay foto'
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-4">
                      <Button
                        layout="link"
                        size="icon"
                        aria-label="Editar"
                        onClick={() => {
                          setProductoSeleccionado(item);
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
                          setProductoAEliminar(item.idProducto);
                          setModalConfirmacionVisible(true);
                        }}
                      >
                        <TrashIcon className="w-5 h-5" aria-hidden="true" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
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

      {/* Modal Confirmación eliminación */}
      <Modal isOpen={modalConfirmacionVisible} onClose={() => setModalConfirmacionVisible(false)}>
        <ModalBody>¿Está seguro de eliminar este registro permanentemente?</ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => setModalConfirmacionVisible(false)}>
            Cancelar
          </Button>
          <Button color="danger" onClick={() => eliminarProducto(productoAEliminar)}>
            Aceptar
          </Button>
        </ModalFooter>
      </Modal>

      {/* Modal formulario registro/edición */}
      <Modal isOpen={modalAbierto} onClose={() => setModalAbierto(false)} size="large">
        <ModalBody>
          <ProductoRegistro
            closeModal={() => setModalAbierto(false)}
            onRegistroExitoso={manejarRegistroExitoso}
            producto={productoSeleccionado}
          />
        </ModalBody>
      </Modal>

      {/* Modal foto ampliada */}
      <Modal isOpen={modalFotoAbierto} onClose={() => setModalFotoAbierto(false)}>
        <ModalBody className="flex justify-center">
          {fotoSeleccionada && (
            <img
              src={fotoSeleccionada}
              alt="Foto ampliada"
            />
          )}
        </ModalBody>
      </Modal>
    </>
  );
}

export default Producto;
