DELETE FROM personas;
DELETE FROM citas;
DELETE FROM comunicaciones;
DELETE FROM entidades;
DELETE FROM appusers;
DELETE FROM authorities;

INSERT INTO authorities(id,authority) VALUES (1,'ADMIN');
INSERT INTO appusers(id,username,password,authority) VALUES 
(1,'rosa','$2a$10$YdddnWmBEG/mL83kmQv3Ge6WHzCuDbOJaOMv01FWBT/pf1uyqVtT6',1);

INSERT INTO authorities(id,authority) VALUES (2,'ENTIDAD');
INSERT INTO appusers (id, username, password, authority) VALUES
(2, 'entidad1', '$2a$10$YdddnWmBEG/mL83kmQv3Ge6WHzCuDbOJaOMv01FWBT/pf1uyqVtT6', 2),
(3, 'entidad2', '$2a$10$YdddnWmBEG/mL83kmQv3Ge6WHzCuDbOJaOMv01FWBT/pf1uyqVtT6', 2),
(4, 'entidad3', '$2a$10$YdddnWmBEG/mL83kmQv3Ge6WHzCuDbOJaOMv01FWBT/pf1uyqVtT6', 2),
(5, 'entidad4', '$2a$10$YdddnWmBEG/mL83kmQv3Ge6WHzCuDbOJaOMv01FWBT/pf1uyqVtT6', 2),
(6, 'entidad5', '$2a$10$YdddnWmBEG/mL83kmQv3Ge6WHzCuDbOJaOMv01FWBT/pf1uyqVtT6', 2),
(7, 'entidad6', '$2a$10$YdddnWmBEG/mL83kmQv3Ge6WHzCuDbOJaOMv01FWBT/pf1uyqVtT6', 2),
(8, 'entidad7', '$2a$10$YdddnWmBEG/mL83kmQv3Ge6WHzCuDbOJaOMv01FWBT/pf1uyqVtT6', 2),
(9, 'entidad8', '$2a$10$YdddnWmBEG/mL83kmQv3Ge6WHzCuDbOJaOMv01FWBT/pf1uyqVtT6', 2),
(10, 'entidad9', '$2a$10$YdddnWmBEG/mL83kmQv3Ge6WHzCuDbOJaOMv01FWBT/pf1uyqVtT6', 2),
(11, 'entidad10', '$2a$10$YdddnWmBEG/mL83kmQv3Ge6WHzCuDbOJaOMv01FWBT/pf1uyqVtT6', 2),
(12, 'entidad11', '$2a$10$YdddnWmBEG/mL83kmQv3Ge6WHzCuDbOJaOMv01FWBT/pf1uyqVtT6', 2),
(13, 'entidad12', '$2a$10$YdddnWmBEG/mL83kmQv3Ge6WHzCuDbOJaOMv01FWBT/pf1uyqVtT6', 2),
(14, 'entidad13', '$2a$10$YdddnWmBEG/mL83kmQv3Ge6WHzCuDbOJaOMv01FWBT/pf1uyqVtT6', 2),
(15, 'entidad14', '$2a$10$YdddnWmBEG/mL83kmQv3Ge6WHzCuDbOJaOMv01FWBT/pf1uyqVtT6', 2);

INSERT INTO entidades (id, user_id, codigo, nombre, nif, tipo, descripcion, direccion, poblacion, cp, email, telefono1, telefono2, beneficiarios, campo1, campo2) 
VALUES (1, 2, 'B0001', 'RELIGIOSAS DOMINICAS MADRE DE DIOS', 'R4100014B', 'COMUNIDAD_RELIGIOSA', 'CONSUMO', 'C/ SAN JOSÉ 4', 'SEVILLA', '41004', 'dominicassevillaop@hotmail.com', '954217822', '695663359', 20, 0, 0),
(2, 3, 'B0004', 'ONG REMAR.', 'G41773987', 'CENTROS_DE_INSERCIÓN', 'CONSUMO', 'DISEMINADOS 4-6', 'ALCALÁ DE GUADAÍRA', '41500', 'libradacamacho@remar.org', '648644930', '699088859', 77, 0, 1),
(3, 4, 'B0005', 'ASOCIACIÓN BETEL', 'G78581386', 'CENTROS_DE_INSERCIÓN', 'CONSUMO', 'C/ JARDIN DE LA ISLA,6 M EXPOLOCAL', 'SEVILLA', '41014', 'sevilla@betel.org', '954680845', '670667910', 43, 0, 0),
(4, 5, 'B0006', 'MERCEDARIAS DESCALZAS MONASTERIO DE LA ENCARNACIÓN', 'R4100139G', 'COMUNIDAD_RELIGIOSA', 'CONSUMO', 'PLAZA DE LA ENCARNACIÓN, 2', 'OSUNA', '41640', 'mercedariasdescalzasosuna@hotmail.com', '954811121', '686618520', 20, 0, 0),
(5, 6, 'B0009', 'MONASTERIO DE SAN LEANDRO', 'R4100137A', 'COMUNIDAD_RELIGIOSA', 'CONSUMO', 'PLAZA SAN ILDEFONSO, 1', 'SEVILLA', '41003', 'monasteriodesanleandro@hotmail.com', '656493674', '954224195', 25, 0, 0),
(6, 7, 'B0011', 'ASOCIACIÓN HOGAR DE NAZARET', 'R1400052E', 'CASAS_DE_AGOGIDAS', 'CONSUMO', 'PLAZA PAPA JUAN PABLO I', 'SEVILLA', '41010', 'consu_nazaret@yahoo.es', '954281999', '627242575', 47, 0, 2),
(7, 8, 'B0018', 'HOSPITAL DE LA SANTA CARIDAD', 'G41041617', 'CASAS_DE_AGOGIDAS', 'CONSUMO', 'C/TEMPRADO, 3', 'SEVILLA', '41001', 'direccion@santa-caridad.es', '954223232', NULL, 82, 0, 0),
(8, 9, 'B0021', 'COCINA ECONÓMICA NUESTRA SEÑORA DEL ROSARIO', 'R4100174D', 'COMEDOR_SOCIAL', 'CONSUMO', 'C/PAGÉS DEL CORRO, 34', 'SEVILLA', '41010', 'comunidadcomedor@gmail.com', '659055937', '954347087', 260, 0, 0),
(9, 10, 'B0022', 'COMEDOR BENÉFICO SAN VICENTE DE PAUL', 'R4100103C', 'COMEDOR_SOCIAL', 'CONSUMO', 'C/ ANICETO SAENZ,5-7', 'SEVILLA', '41003', 'comedorsvpaulse@telefonica.net', '635022270', '653794638', 349, 0, 0),
(10, 11, 'B0023', 'MADRES CARMELITAS MONASTERIO PURÍSIMA CONCEPCION', 'R4100023C', 'COMUNIDAD_RELIGIOSA', 'CONSUMO', 'C/PONCE DE LEON, 11', 'UTRERA', '41710', 'carmelitasutrera@gmail.com', '682540078', '954860289', 20, 0, 0),
(11, 12, 'B0027', 'ASOCIACIÓN DE VOLUNTARIADO SOCIAL Y ECUMÉNICO CRISTO VIVE', 'G41381930', 'CASAS_DE_AGOGIDAS', 'CONSUMO', 'C/ FERIA, 112', 'SEVILLA', '41002', 'asociacioncristovive@gmail.com', '954388303', '648043152', 22, 0, 0),
(12, 13, 'B0029', 'CONGREGACIÓN TERCIARIA FRANCISCANA', 'R4100030H', 'COMUNIDAD_RELIGIOSA', 'CONSUMO', 'PLAZA DEL POZO SANTO, 1', 'SEVILLA', '41003', 'trabajosocial.pozosanto@gmail.com', '954221898', '685748898', 20, 0, 0),
(13, 14, 'B0031', 'PARROQUIA DE SAN JOSÉ', 'R4100458A', 'PARROQUIA', 'REPARTO', 'C/SAN JOSE DE CALASANZ, 1', 'MORÓN DE LA FRONTERA', '41530', 'ssayaogo@gmail.com', '954852792', '628045335', 133, 0, 0),
(14, 15, 'B0036', 'PARROQUIA DE SAN BARTOLOMÉ Y SAN ESTEBAN', 'R4100289J', 'PARROQUIA', 'REPARTO', 'C/VIRGEN DE LA ALEGRÍA, 2', 'SEVILLA', '41004', 'caridad.sanbartolomeysanesteban@gmail.com', '676083598', '954419357', 101, 0, 0);

INSERT INTO comunicaciones (id, fecha, titulo, estado, descripcion, respuesta, entidad_id)
VALUES (1, '2023-01-01', 'Nuevas intolerancias', 'PENDIENTE', 'Descripción de la reunión', NULL, 1),
(2, '2024-02-01', 'Duda cesta', 'RESPONDIDA', 'Descripción de la reunión', NULL, 1),
(3, '2022-06-13', 'Fin de curso', 'LLAMAR', 'Descripción de la reunión', NULL, 2),
(4, '2023-07-01', 'Reunión Importante', 'PENDIENTE', 'Descripción de la reunión', NULL, 2),
(5, '2023-08-26', 'Reunión Importante', 'REUNION', 'Descripción de la reunión', NULL, 3);

INSERT INTO citas (id, fecha, hora, palet, estado, entidad_id)
values (1, '2023-03-15', '10:00:00', 1, 'ENVIADA', 1),
(2, '2024-02-20', '14:30:00', 2, 'ENVIADA', 2),
(3, '2024-02-25', '12:00:00', 3, 'ENVIADA', 3),
(4, '2024-03-10', '09:45:00', 1, 'ENVIADA', 4),
(5, '2024-03-10', '16:15:00', 2, 'ENVIADA', 1),
(6, '2024-04-18', '11:30:00', 3, 'ENVIADA', 2),
(7, '2024-04-22', '14:00:00', 1, 'ENVIADA', 3),
(8, '2024-05-05', '10:45:00', 2, 'ENVIADA', 4),
(9, '2024-05-15', '13:20:00', 3, 'ACEPTADA', 1),
(10, '2024-05-22', '15:00:00', 1, 'ENVIADA', 2);

INSERT INTO citas (id, fecha, hora, palet, estado, comentario, entidad_id)
values (11, '2023-03-20', '10:00:00', 1, 'ENVIADA', 'Este es un ejemplo de incidencia',1);

INSERT INTO personas(nombre, apellidos, edad, otros, entidad_id)
VALUES('Juan', 'González', 35, 'Ninguno', 13),
('María', 'López', 28, 'Diabetes', 13),
('Pedro', 'Martínez', 42, 'Asma', 13),
('Ana', 'Sánchez', 19, 'Autismo', 13),
('Carlos', 'Pérez', 60, 'Hipertensión', 13);



























