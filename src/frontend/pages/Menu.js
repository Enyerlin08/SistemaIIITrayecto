import React, { useState, useEffect } from 'react';
import PageTitle from '../components/Typography/PageTitle';
import SectionTitle from '../components/Typography/SectionTitle';
import {
  Button,
  Card,
  CardBody,
  Modal,
  ModalBody,
  Input,
} from '@windmill/react-ui';
import axios from '../servicio/api';
import MenuRegistro from '../components/formularios/registro/MenuRegistro';

function Menu() {
  const [menus, setMenus] = useState([]);
  const [maximasCantidades, setMaximasCantidades] = useState({});
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  useEffect(() => {
    fetchMenus();
  }, []);

  const fetchMenus = async () => {
    try {
      const response = await axios.get('/menus/disponibles');
      setMenus(response.data);
      const cantidades = {};
      for (const menu of response.data) {
        const maxCant = await axios.get(`/menus/maxima-cantidad/${menu.id}`);
        cantidades[menu.id] = maxCant.data.maxima_cantidad || 0;
      }
      setMaximasCantidades(cantidades);
    } catch (error) {
      console.error('Error al cargar menús:', error);
      setMessage('Error al cargar los menús');
      setMessageType('danger');
    }
  };

  const handlePrepararMenu = (id) => {
    setSelectedMenu(id);
    setCantidad(1);
    setIsModalOpen(true);
  };

  const confirmPreparar = async () => {
    if (cantidad > maximasCantidades[selectedMenu] || cantidad < 1) {
      setMessage('La cantidad excede el máximo disponible o es inválida');
      setMessageType('danger');
      return;
    }
    try {
      await axios.post(`/menus/preparar/${selectedMenu}`, { cantidad });
      setMessage(`Preparados ${cantidad} menús`);
      setMessageType('success');
      setIsModalOpen(false);
      fetchMenus();
      setTimeout(() => {
        setMessage('');
        setMessageType('');
      }, 3000);
    } catch (error) {
      setMessage(error.response?.data?.error || 'Error al preparar el menú');
      setMessageType('danger');
    }
  };

  const handleEliminarMenu = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este menú?')) {
      try {
        await axios.delete(`/menus/eliminar/${id}`);
        setMessage('Menú eliminado con éxito');
        setMessageType('success');
        fetchMenus();
        setTimeout(() => {
          setMessage('');
          setMessageType('');
        }, 3000);
      } catch (error) {
        setMessage('Error al eliminar el menú');
        setMessageType('danger');
      }
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMenu(null);
    setCantidad(1);
  };

  const openRegistrationModal = () => setIsModalOpen(true);

  return (
    <>
      <PageTitle>Menús Disponibles</PageTitle>

      <div className="mb-4">
        <Button onClick={openRegistrationModal}>Registrar Nuevo Menú</Button>
      </div>

      <SectionTitle className="mt-4">Catálogo de Menús</SectionTitle>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {menus.map((menu) => (
          <Card key={menu.id} className="hover:shadow-lg transition-shadow">
            <CardBody>
              <h3 className="text-lg font-semibold">{menu.nombre}</h3>
              {menu.platos && menu.platos.length > 0 && (
                <ul className="text-gray-600 mt-2">
                  {menu.platos.map((plato, index) => (
                    <li key={index}>{plato.nombre_plato}</li>
                  ))}
                </ul>
              )}
              <p className="text-green-600 font-bold">
                Cantidad Máxima: {maximasCantidades[menu.id] || 0}
              </p>
              <div className="mt-4 flex gap-2">
                <Button
                  className="flex-1"
                  onClick={() => handlePrepararMenu(menu.id)}
                  disabled={!maximasCantidades[menu.id]}
                >
                  Preparar Menú
                </Button>
                <Button
                  layout="outline"
                  className="flex-1"
                  onClick={() => handleEliminarMenu(menu.id)}
                >
                  Eliminar
                </Button>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {message && (
        <div className={`fixed bottom-4 right-4 p-4 rounded-md ${messageType === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ModalBody>
          {selectedMenu ? (
            <>
              <h3 className="text-lg font-semibold mb-4">Preparar Menú</h3>
              <p>Seleccione la cantidad a preparar:</p>
              <Input
                type="number"
                min="1"
                max={maximasCantidades[selectedMenu] || 0}
                value={cantidad}
                onChange={(e) => setCantidad(Math.min(parseInt(e.target.value) || 1, maximasCantidades[selectedMenu] || 0))}
                className="mt-2 w-full"
                placeholder="Cantidad"
              />
              <div className="mt-4 flex justify-end gap-4">
                <Button layout="outline" onClick={closeModal}>
                  Cancelar
                </Button>
                <Button onClick={confirmPreparar}>Confirmar</Button>
              </div>
            </>
          ) : (
            <MenuRegistro closeModal={closeModal} onRegistroExitoso={fetchMenus} />
          )}
        </ModalBody>
      </Modal>
    </>
  );
}

export default Menu;