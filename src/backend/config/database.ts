import { Pool } from "pg"; //se exporta la libreria pg
import dotenv from "dotenv"; // se exporta la libreria dotenv

dotenv.config(); //se configura para usar archivo .env

const pool = new Pool({ //se crea la variable llamada pool
  user: process.env.DB_USER, //obtiene el usario de la variable DB_USER del archivo .env
  host: process.env.DB_HOST,//obtiene host de la variable DB_HOST del archivo .env
  database: process.env.DB_NAME,//obtiene el nombre de la base de datos de la variable DB_NAME del archivo .env
  password: process.env.DB_PASSWORD,//obtiene la contraseña de la variable DB_PSDDWORD del archivo .env
  port: Number(process.env.DB_PORT),//obtiene el puerto de la variable DB_PORT del archivo .env
});

export default pool; //exporta el archivo
