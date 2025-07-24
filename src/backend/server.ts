import express from 'express';
import cors from 'cors';
import cargoRuta from './ruta/CargoRuta';
import marcaRuta from './ruta/MarcaRuta';
import personaRuta from './ruta/PersonaRuta';
import tipoRuta from './ruta/TipoRuta';
import usuarioRuta from './ruta/UsuarioRuta';
import complejoRuta from './ruta/ComplejoRuta';
import productoRuta from './ruta/ProductoRuta';
import loginRuta from './ruta/LoginRuta';
import gradoRuta from './ruta/GradoRuta';
import platoRuta from './ruta/PlatoRuta';
import MenuRuta from './ruta/MenuRuta'; // Importar la ruta de Menú
import path from 'path';
const app = express();

// Configuración de CORS
const corsOptions = {
  origin: 'http://localhost:3001', // Permitir solo solicitudes del frontend en el puerto 3001
  methods: 'GET,POST,PUT,DELETE', // Métodos permitidos
};
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(cors(corsOptions)); // Habilitar CORS con opciones
app.use(express.json()); // Parsear JSON en las solicitudes

// Ruta principal para cargos
app.use('/api/cargos', cargoRuta);
app.use('/api/marcas', marcaRuta);
app.use('/api/personas', personaRuta);
app.use('/api/tipos', tipoRuta);
app.use('/api/usuarios', usuarioRuta);
app.use('/api/complejos', complejoRuta);
app.use('/api/productos', productoRuta);
app.use('/api/login', loginRuta);
app.use('/api/grados', gradoRuta);
app.use('/api/platos', platoRuta);
app.use('/api/menus', MenuRuta); // Registrar la ruta de Menú

// Manejador de errores global
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
