-- =====================================================================
-- SIGER - DATOS A INCLUIR PARA CONSTRUCCION DE LA DB
-- =====================================================================

INSERT INTO usuarios (nombres, apellidos, email, contraseña, estado, rol) VALUES
('Carlos Alberto', 'Mejía Rivas', 'carlos.mejia@siger.edu.sv',
 '$2a$10$x2URZY5Z7aP4E48RouP37egnE4ux.fX.JREnPgltkemhMQpB6sqYe', TRUE, 'ADMINISTRADOR');

INSERT INTO administradores (id_usuario) VALUES (1);


-- USUARIOS (id 1 admin ya creado arriba; 2 admin, 3-5 organizadores, 6-12 participantes)
INSERT INTO usuarios (nombres, apellidos, email, contraseña, estado, rol) VALUES
('Ana Lucía',        'Hernández Pineda',   'ana.hernandez@siger.edu.sv',    '$2a$10$x2URZY5Z7aP4E48RouP37egnE4ux.fX.JREnPgltkemhMQpB6sqYe', TRUE,  'ADMINISTRADOR'),
('Roberto José',     'Martínez Cruz',      'roberto.martinez@siger.edu.sv', '$2a$10$x2URZY5Z7aP4E48RouP37egnE4ux.fX.JREnPgltkemhMQpB6sqYe', TRUE,  'ORGANIZADOR'),
('María Fernanda',   'López Aguilar',      'maria.lopez@siger.edu.sv',      '$2a$10$x2URZY5Z7aP4E48RouP37egnE4ux.fX.JREnPgltkemhMQpB6sqYe', TRUE,  'ORGANIZADOR'),
('Jorge Luis',       'Ramírez Guzmán',     'jorge.ramirez@siger.edu.sv',    '$2a$10$x2URZY5Z7aP4E48RouP37egnE4ux.fX.JREnPgltkemhMQpB6sqYe', TRUE,  'ORGANIZADOR'),
('Daniela Michelle', 'Flores Castillo',    'daniela.flores@siger.edu.sv',   '$2a$10$x2URZY5Z7aP4E48RouP37egnE4ux.fX.JREnPgltkemhMQpB6sqYe', TRUE,  'PARTICIPANTE'),
('Kevin Alexander',  'Ortiz Menjívar',     'kevin.ortiz@siger.edu.sv',      '$2a$10$x2URZY5Z7aP4E48RouP37egnE4ux.fX.JREnPgltkemhMQpB6sqYe', TRUE,  'PARTICIPANTE'),
('Sofía Raquel',     'Chávez Ayala',       'sofia.chavez@siger.edu.sv',     '$2a$10$x2URZY5Z7aP4E48RouP37egnE4ux.fX.JREnPgltkemhMQpB6sqYe', TRUE,  'PARTICIPANTE'),
('Diego Armando',    'Portillo Rosales',   'diego.portillo@siger.edu.sv',   '$2a$10$x2URZY5Z7aP4E48RouP37egnE4ux.fX.JREnPgltkemhMQpB6sqYe', TRUE,  'PARTICIPANTE'),
('Valeria Beatriz',  'Serrano Molina',     'valeria.serrano@siger.edu.sv',  '$2a$10$x2URZY5Z7aP4E48RouP37egnE4ux.fX.JREnPgltkemhMQpB6sqYe', TRUE,  'PARTICIPANTE'),
('Luis Enrique',     'Alvarado Pérez',     'luis.alvarado@siger.edu.sv',    '$2a$10$x2URZY5Z7aP4E48RouP37egnE4ux.fX.JREnPgltkemhMQpB6sqYe', TRUE,  'PARTICIPANTE'),
('Gabriela Nicole',  'Rivera Quintanilla', 'gabriela.rivera@siger.edu.sv',  '$2a$10$x2URZY5Z7aP4E48RouP37egnE4ux.fX.JREnPgltkemhMQpB6sqYe', FALSE, 'PARTICIPANTE');

-- TABLAS DE ROL (el trigger valida que coincidan con usuarios.rol)
INSERT INTO administradores (id_usuario) VALUES (2);
INSERT INTO organizadores   (id_usuario) VALUES (3), (4), (5);
INSERT INTO participantes   (id_usuario) VALUES (6), (7), (8), (9), (10), (11), (12);

-- UBICACIONES
INSERT INTO ubicaciones (lugar, sede) VALUES
('Auditorio Central',            'Facultad Multidisciplinaria de Occidente'),
('Laboratorio de Computación 3', 'Facultad Multidisciplinaria de Occidente'),
('Sala de Conferencias',         'Facultad Multidisciplinaria de Occidente'),
('Aula Magna',                   'Facultad Multidisciplinaria de Occidente'),
('Biblioteca Central',           'Universidad de El Salvador, Sede Central'),
('Salón de Usos Múltiples',      'Universidad de El Salvador, Sede Central'),
('Cancha Techada',               'Facultad Multidisciplinaria de Occidente');

-- EVENTOS
-- cupo_disponible = capacidad_maxima - reservaciones NO canceladas del evento
INSERT INTO eventos (nombre, fecha, id_ubicacion, capacidad_maxima, descripcion, cupo_disponible, estado, id_organizador) VALUES
('Congreso de Ingeniería de Software 2026', '2026-11-20 09:00', 1, 150, 'Conferencias y talleres sobre desarrollo de software y buenas prácticas.', 149, 'Activo',       3),
('Taller de Bases de Datos con PostgreSQL',  '2026-11-12 14:00', 2,  25, 'Taller práctico de modelado y consultas SQL.',                              23, 'Activo',       3),
('Feria de Emprendimiento Universitario',    '2026-12-03 08:30', 4, 200, 'Exposición de proyectos de emprendimiento estudiantil.',                   200, 'Cancelado',    4),
('Charla de Ciberseguridad',                 '2026-11-27 10:00', 3,  60, 'Introducción a la seguridad informática y protección de datos.',            60, 'Reprogramado', 4),
('Hackathon SIGER 2026',                     '2026-10-15 08:00', 5,  40, 'Maratón de programación de 8 horas por equipos.',                           35, 'Finalizado',   5),
('Seminario de Inteligencia Artificial',     '2026-12-10 15:00', 6,  80, NULL,                                                                        80, 'Activo',       5),
('Conversatorio de Egresados',               '2026-11-06 16:00', 7,   2, 'Encuentro con egresados de Ingeniería de Sistemas. Cupo reducido.',         0, 'Activo',       3);

-- RESERVACIONES
-- Las del Hackathon (evento 5) son anteriores al 15 de octubre.
INSERT INTO reservaciones (fecha_reservacion, codigo_reservacion, estado, id_evento, id_participante) VALUES
('2026-10-01', 'RES-2026-0001', 'Confirmada', 5,  6),
('2026-10-02', 'RES-2026-0002', 'Confirmada', 5,  7),
('2026-10-03', 'RES-2026-0003', 'Confirmada', 5,  8),
('2026-10-25', 'RES-2026-0004', 'Confirmada', 1,  6),
('2026-10-26', 'RES-2026-0005', 'Pendiente',  2,  9),
('2026-10-27', 'RES-2026-0006', 'Confirmada', 2, 10),
('2026-10-27', 'RES-2026-0007', 'Cancelada',  3, 11),
('2026-10-28', 'RES-2026-0008', 'Confirmada', 7,  6),
('2026-10-28', 'RES-2026-0009', 'Confirmada', 7,  7),
('2026-10-29', 'RES-2026-0010', 'Cancelada',  2, 11),
('2026-10-05', 'RES-2026-0011', 'Confirmada', 5,  9),
('2026-10-06', 'RES-2026-0012', 'Confirmada', 5, 10);

-- ASISTENCIA (solo del evento finalizado: Hackathon SIGER 2026)
INSERT INTO asistencia (fecha_registro, estado_asistencia, id_reservacion) VALUES
('2026-10-15 08:05', TRUE,  1),
('2026-10-15 08:12', TRUE,  2),
('2026-10-15 12:00', FALSE, 3),
('2026-10-15 08:20', TRUE,  11),
('2026-10-15 08:31', TRUE,  12);

-- REPORTES
INSERT INTO reportes (tipo_reporte, fecha_generacion, id_usuario_generador) VALUES
('Asistencia',    '2026-10-16', 5),
('Eventos',       '2026-10-18', 1),
('Usuarios',      '2026-10-19', 2),
('Reservaciones', '2026-10-24', 3),
('Asistencia',    '2026-10-26', 5),
('Eventos',       '2026-10-27', 4),
('Reservaciones', '2026-10-29', 1);

-- NOTIFICACIONES (todas con fecha de envío ya transcurrida)
INSERT INTO notificaciones (mensaje, tipo, fecha_envio, id_usuario) VALUES
('Tu reservación RES-2026-0004 al Congreso de Ingeniería de Software 2026 fue confirmada.', 'Confirmación', '2026-10-25 10:15:03',  6),
('Tu reservación RES-2026-0006 al Taller de Bases de Datos con PostgreSQL fue confirmada.', 'Confirmación', '2026-10-27 09:40:21', 10),
('Tu reservación RES-2026-0008 al Conversatorio de Egresados fue confirmada.',             'Confirmación', '2026-10-28 11:22:45',  6),
('Recordatorio: el Hackathon SIGER 2026 es mañana, 15 de octubre, a las 08:00.',           'Recordatorio', '2026-10-14 08:00:00',  6),
('Recordatorio: el Hackathon SIGER 2026 es mañana, 15 de octubre, a las 08:00.',           'Recordatorio', '2026-10-14 08:00:00',  7),
('La Feria de Emprendimiento Universitario fue cancelada. Tu reservación RES-2026-0007 queda sin efecto.', 'Cancelación', '2026-10-28 14:30:00', 11),
('Has cancelado tu reservación RES-2026-0010 al Taller de Bases de Datos con PostgreSQL.',  'Cancelación', '2026-10-29 16:05:12', 11);