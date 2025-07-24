// db.js

// Importar el módulo Pool de pg para manejar el pool de conexiones
const { Pool } = require('pg');

// Importar dotenv para cargar las variables de entorno desde un archivo .env
require('dotenv').config();

// Crear un nuevo pool de conexiones con la configuración proporcionada por las variables de entorno
const pool = new Pool({
  host: process.env.DB_HOST,       // Dirección del host de la base de datos
  database: process.env.DB_NAME,   // Nombre de la base de datos
  user: process.env.DB_USER,       // Nombre de usuario para acceder a la base de datos
  password: process.env.DB_PASSWORD,  // Contraseña para acceder a la base de datos (Asegúrate de incluir la contraseña)
  port: process.env.DB_PORT,       // Puerto en el que está escuchando el servidor de la base de datos
});

// Intentar conectar al inicio del módulo
pool.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);  // Mostrar un mensaje de error si la conexión falla
    return;
  }
  console.log('Connected to the PostgreSQL database.');  // Mostrar un mensaje si la conexión es exitosa
});

// Exportar el pool de conexiones para que otros módulos puedan usarlo
module.exports = pool;