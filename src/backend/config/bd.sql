CREATE TABLE cargo (
    id SERIAL PRIMARY KEY NOT NULL,
    nombre VARCHAR NOT NULL,
    status CHAR(1) DEFAULT 'A' NOT NULL,
    CONSTRAINT check_status CHECK (status IN ('A', 'I'))
); 

CREATE TABLE persona (
    id SERIAL PRIMARY KEY NOT NULL,
    cedula VARCHAR NOT NULL,
    nombre VARCHAR NOT NULL,
	apellido VARCHAR NOT NULL,
    "idCargo" INTEGER NOT NULL,
	status CHAR(1) DEFAULT 'A' NOT NULL,
    FOREIGN KEY ("idCargo") REFERENCES cargo(id)
);

CREATE TABLE complejoeducativo (
    id SERIAL PRIMARY KEY NOT NULL,
    nombre VARCHAR NOT NULL,
    codigo INTEGER NOT NULL,
    fecha DATE NOT NULL,
    "idPersona" INTEGER NOT NULL,
    status CHAR(1) DEFAULT 'A' NOT NULL,
    FOREIGN KEY ("idPersona") REFERENCES persona(id)  
);


CREATE TABLE marca (
    id SERIAL PRIMARY KEY NOT NULL,
    nombre VARCHAR NOT NULL,
	status CHAR(1) DEFAULT 'A' NOT NULL,
    CONSTRAINT check_status CHECK (status IN ('A', 'I'))
);

CREATE TABLE tipo (
    id SERIAL PRIMARY KEY NOT NULL,
    nombre VARCHAR NOT NULL,
	status CHAR(1) DEFAULT 'A' NOT NULL,
    CONSTRAINT check_status CHECK (status IN ('A', 'I'))
);

CREATE TABLE usuario (
  id SERIAL PRIMARY KEY NOT NULL,
  nombre VARCHAR NOT NULL,
  contraseña VARCHAR(255) NOT NULL,
  tipousuario Varchar NOT NULL,
  "idPersona" INTEGER NOT NULL,
  status CHAR(1) DEFAULT 'A' NOT NULL,
  FOREIGN KEY ("idPersona") REFERENCES persona(id)
);

CREATE TABLE producto (
  id SERIAL PRIMARY KEY NOT NULL,
  nombre VARCHAR NOT NULL,
  foto Varchar NOT NULL,
  "idTipo" INTEGER NOT NULL,
  "idMarca" INTEGER NOT NULL,
  status CHAR(1) DEFAULT 'A' NOT NULL,
  FOREIGN KEY ("idTipo") REFERENCES tipo(id),
  FOREIGN KEY ("idMarca") REFERENCES marca(id)
);

CREATE TABLE inventario (
    id SERIAL PRIMARY KEY NOT NULL,
    fechavencimiento DATE NOT NULL,
    Cantidad VARCHAR NOT NULL,
    "idProducto" INTEGER NOT NULL,
    FOREIGN KEY ("idProducto") REFERENCES producto(id)
);

CREATE TABLE grado (
    id SERIAL PRIMARY KEY NOT NULL,
    nombre VARCHAR NOT NULL,
	status CHAR(1) DEFAULT 'A' NOT NULL,
    CONSTRAINT check_status CHECK (status IN ('A', 'I'))
);

CREATE TABLE personal (
    id SERIAL PRIMARY KEY NOT NULL,
    cantida INTEGER NOT NULL,
    fecha DATE NOT NULL
);

CREATE TABLE asistencia (
    id SERIAL PRIMARY KEY NOT NULL,
    cantida INTEGER NOT NULL,
    "idGrado" INTEGER NOT NULL,
    fecha DATE NOT NULL,
    "idPersonal" INTEGER NOT NULL,
    FOREIGN KEY ("idGrado") REFERENCES grado(id)
);


CREATE TABLE plato (
    id SERIAL PRIMARY KEY NOT NULL,
    Nombre VARCHAR(100) NOT NULL,
    Descripcion TEXT,
    Status VARCHAR(20) DEFAULT 'Activo'
);

CREATE TABLE plato_ingrediente (
    id SERIAL PRIMARY KEY NOT NULL,
    Id_plato INTEGER NOT NULL,
    Id_producto INTEGER NOT NULL,
    Cantidad DECIMAL(10,2) NOT NULL, -- Cantidad en kg o unidades por porción
    FOREIGN KEY (Id_plato) REFERENCES plato(ID),
    FOREIGN KEY (Id_producto) REFERENCES producto(id)
);

CREATE TABLE menu (
    id SERIAL PRIMARY KEY NOT NULL,
    Nombre VARCHAR(100) NOT NULL,
    Status VARCHAR(20) DEFAULT 'Activo',
    fecha DATE DEFAULT CURRENT_DATE
);

CREATE TABLE menu_plato (
    id SERIAL PRIMARY KEY NOT NULL,
    id_menu INTEGER NOT NULL,
    id_plato INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'Activo',
    FOREIGN KEY (id_menu) REFERENCES menu(id) ON DELETE CASCADE,
    FOREIGN KEY (id_plato) REFERENCES plato(id) ON DELETE CASCADE
);