DROP TABLE IF EXISTS personas;
DROP TABLE IF EXISTS citas;
DROP TABLE IF EXISTS comunicaciones;
DROP TABLE IF EXISTS entidades;
DROP TABLE IF EXISTS appusers;
DROP TABLE IF EXISTS authorities;

CREATE TABLE authorities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    authority VARCHAR(255) NOT NULL
);

CREATE TABLE appusers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    authority INT,
    FOREIGN KEY (authority) REFERENCES authorities(id)
);

CREATE TABLE entidades (
    id INT PRIMARY KEY,
    user_id INT,
    codigo VARCHAR(255) UNIQUE NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    nif VARCHAR(20) UNIQUE NOT NULL,
    tipo ENUM (
    'COMUNIDAD_RELIGIOSA',
    'CENTROS_DE_INSERCION',
    'CASAS_DE_AGOGIDAS',
    'COMEDOR_SOCIAL',
    'PARROQUIA',
    'CENTRO_ASISTENCIAL',
    'GUARDERIA',
    'APOYO_ADICCIONES',
    'APOYO_A_MENORES_Y_ADOLESCENTES'
	) NOT NULL,
    descripcion ENUM (
        'CONSUMO',
        'REPARTO'
    ) NOT NULL,
    direccion VARCHAR(255) NOT NULL,
    poblacion VARCHAR(255) NOT NULL,
    cp VARCHAR(5) NOT NULL,
    email VARCHAR(255) NOT NULL,
    telefono1 VARCHAR(9) NOT NULL,
    telefono2 VARCHAR(9),
    beneficiarios INT NOT NULL,
    campo1 INT NOT NULL,
    campo2 INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES appusers(id)
);

CREATE TABLE comunicaciones (
    id INT PRIMARY KEY,
    fecha DATE NOT NULL,
    titulo VARCHAR(255) NOT NULL,
    estado ENUM ('PENDIENTE', 'RESPONDIDA', 'LLAMAR', 'REUNION') NOT NULL,
    descripcion TEXT NOT NULL,
    respuesta TEXT,
    entidad_id INT,
    FOREIGN KEY (entidad_id) REFERENCES entidades(id)
);

CREATE TABLE citas (
    id INT PRIMARY KEY,
    fecha DATE NOT NULL,
    hora TIME NOT NULL,
    palet INT,
    estado ENUM ('ENVIADA', 'ACEPTADA', 'VALIDADA', 'CANCELADA') NOT NULL,
    comentario VARCHAR (255),
    entidad_id INT,
    FOREIGN KEY (entidad_id) REFERENCES entidades(id)
);

CREATE TABLE personas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    apellidos VARCHAR(255) NOT NULL,
    edad INT NOT NULL,
    otros TEXT,
    entidad_id INT,
    FOREIGN KEY (entidad_id) REFERENCES entidades(id)
);


