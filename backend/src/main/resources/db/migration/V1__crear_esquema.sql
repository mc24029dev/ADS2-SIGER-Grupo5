-- TABLAS ---

CREATE TABLE usuarios (
    id_usuario  INT GENERATED ALWAYS AS IDENTITY,
    nombres     VARCHAR(100) NOT NULL,
    apellidos   VARCHAR(100) NOT NULL,
    email       VARCHAR(150) NOT NULL,
    contraseña  VARCHAR(255) NOT NULL,
    estado      BOOLEAN      NOT NULL DEFAULT TRUE,
    rol         VARCHAR(20)  NOT NULL,
    CONSTRAINT pk_usuarios PRIMARY KEY (id_usuario),
    CONSTRAINT uq_usuarios_email UNIQUE (email),
    CONSTRAINT chk_usuarios_rol
        CHECK (rol IN ('ADMINISTRADOR','ORGANIZADOR','PARTICIPANTE'))
);

CREATE TABLE administradores (
    id_usuario INT NOT NULL,
    CONSTRAINT pk_administradores PRIMARY KEY (id_usuario),
    CONSTRAINT fk_administradores_usuario
        FOREIGN KEY (id_usuario) REFERENCES usuarios (id_usuario)
);

CREATE TABLE organizadores (
    id_usuario INT NOT NULL,
    CONSTRAINT pk_organizadores PRIMARY KEY (id_usuario),
    CONSTRAINT fk_organizadores_usuario
        FOREIGN KEY (id_usuario) REFERENCES usuarios (id_usuario)
);

CREATE TABLE participantes (
    id_usuario INT NOT NULL,
    CONSTRAINT pk_participantes PRIMARY KEY (id_usuario),
    CONSTRAINT fk_participantes_usuario
        FOREIGN KEY (id_usuario) REFERENCES usuarios (id_usuario)
);

CREATE TABLE ubicaciones (
    id_ubicacion INT GENERATED ALWAYS AS IDENTITY,
    lugar        VARCHAR(100) NOT NULL,
    sede         VARCHAR(100) NOT NULL,
    CONSTRAINT pk_ubicaciones PRIMARY KEY (id_ubicacion),
    CONSTRAINT uq_ubicaciones_lugar_sede UNIQUE (lugar, sede)
);

-- cupo_disponible lo administra el BACKEND (al crear el evento, al reservar,
-- al cancelar y al editar la capacidad). Los CHECK actúan como red de seguridad.
CREATE TABLE eventos (
    id_evento        INT GENERATED ALWAYS AS IDENTITY,
    nombre           VARCHAR(150) NOT NULL,
    fecha            TIMESTAMP    NOT NULL,
    id_ubicacion     INT          NOT NULL,
    capacidad_maxima INT          NOT NULL,
    descripcion      VARCHAR(300) NULL,
    cupo_disponible  INT          NOT NULL,
    estado           VARCHAR(20)  NOT NULL,
    id_organizador   INT          NOT NULL,
    CONSTRAINT pk_eventos PRIMARY KEY (id_evento),
    CONSTRAINT fk_eventos_ubicacion
        FOREIGN KEY (id_ubicacion) REFERENCES ubicaciones (id_ubicacion),
    CONSTRAINT fk_eventos_organizador
        FOREIGN KEY (id_organizador) REFERENCES organizadores (id_usuario),
    CONSTRAINT chk_eventos_capacidad CHECK (capacidad_maxima > 0),
    CONSTRAINT chk_eventos_cupo
        CHECK (cupo_disponible >= 0 AND cupo_disponible <= capacidad_maxima),
    CONSTRAINT chk_eventos_estado
        CHECK (estado IN ('Activo','Cancelado','Reprogramado','Finalizado'))
);

CREATE TABLE reservaciones (
    id_reservacion     INT GENERATED ALWAYS AS IDENTITY,
    fecha_reservacion  DATE        NOT NULL,
    codigo_reservacion VARCHAR(50) NOT NULL,
    estado             VARCHAR(30) NOT NULL,
    id_evento          INT         NOT NULL,
    id_participante    INT         NOT NULL,
    CONSTRAINT pk_reservaciones PRIMARY KEY (id_reservacion),
    CONSTRAINT uq_reservaciones_codigo UNIQUE (codigo_reservacion),
    CONSTRAINT chk_reservaciones_estado
        CHECK (estado IN ('Pendiente','Confirmada','Cancelada')),
    CONSTRAINT fk_reservaciones_evento
        FOREIGN KEY (id_evento) REFERENCES eventos (id_evento)
        ON DELETE CASCADE,
    CONSTRAINT fk_reservaciones_participante
        FOREIGN KEY (id_participante) REFERENCES participantes (id_usuario)
);

CREATE TABLE asistencia (
    id_asistencia     INT GENERATED ALWAYS AS IDENTITY,
    fecha_registro    TIMESTAMP NOT NULL DEFAULT NOW(),
    estado_asistencia BOOLEAN   NOT NULL DEFAULT FALSE,
    id_reservacion    INT       NOT NULL,
    CONSTRAINT pk_asistencia PRIMARY KEY (id_asistencia),
    CONSTRAINT uq_asistencia_reservacion UNIQUE (id_reservacion),
    CONSTRAINT fk_asistencia_reservacion
        FOREIGN KEY (id_reservacion) REFERENCES reservaciones (id_reservacion)
        ON DELETE CASCADE
);

CREATE TABLE reportes (
    id_reporte           INT GENERATED ALWAYS AS IDENTITY,
    tipo_reporte         VARCHAR(100) NOT NULL,
    fecha_generacion     DATE         NOT NULL DEFAULT NOW(),
    id_usuario_generador INT          NOT NULL,
    CONSTRAINT pk_reportes PRIMARY KEY (id_reporte),
    CONSTRAINT fk_reportes_usuario
        FOREIGN KEY (id_usuario_generador) REFERENCES usuarios (id_usuario)
);

CREATE TABLE notificaciones (
    id_notificacion INT GENERATED ALWAYS AS IDENTITY,
    mensaje         VARCHAR(300) NOT NULL,
    tipo            VARCHAR(30)  NOT NULL,
    fecha_envio     TIMESTAMP    NOT NULL,
    id_usuario      INT          NOT NULL,
    CONSTRAINT pk_notificaciones PRIMARY KEY (id_notificacion),
    CONSTRAINT chk_notificaciones_tipo
        CHECK (tipo IN ('Confirmación','Recordatorio','Cancelación')),
    CONSTRAINT fk_notificaciones_usuario
        FOREIGN KEY (id_usuario) REFERENCES usuarios (id_usuario)
);

-- ÍNDICES ---

-- Evita reservas duplicadas activas del mismo participante al mismo evento.
-- Una reservación cancelada no cuenta, por lo que puede volver a reservar.
CREATE UNIQUE INDEX uq_reservacion_activa
    ON reservaciones (id_evento, id_participante)
    WHERE estado <> 'Cancelada';

-- Índices sobre llaves foráneas (aceleran los JOIN y los borrados en cascada)
CREATE INDEX idx_eventos_organizador      ON eventos (id_organizador);
CREATE INDEX idx_eventos_ubicacion        ON eventos (id_ubicacion);
CREATE INDEX idx_reservaciones_evento     ON reservaciones (id_evento);
CREATE INDEX idx_reservaciones_particip   ON reservaciones (id_participante);
CREATE INDEX idx_reportes_usuario         ON reportes (id_usuario_generador);
CREATE INDEX idx_notificaciones_usuario   ON notificaciones (id_usuario);


---- TRIGGERS (solo integridad de datos) ---

-- TRIGGER 1: coherencia del rol
-- Un usuario solo puede registrarse en la tabla de rol que coincide con
-- su campo "rol", por lo que nunca queda en dos tablas de rol a la vez.

CREATE OR REPLACE FUNCTION fn_validar_rol()
RETURNS TRIGGER AS $$
DECLARE
    v_rol VARCHAR(20);
BEGIN
    SELECT rol INTO v_rol
    FROM usuarios
    WHERE id_usuario = NEW.id_usuario;

    IF v_rol IS NULL THEN
        RAISE EXCEPTION 'El usuario % no existe en la tabla usuarios', NEW.id_usuario;
    END IF;

    IF v_rol <> TG_ARGV[0] THEN
        RAISE EXCEPTION 'El usuario % tiene rol %, no puede registrarse en %',
            NEW.id_usuario, v_rol, TG_TABLE_NAME;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_validar_rol_administradores
    BEFORE INSERT ON administradores
    FOR EACH ROW EXECUTE FUNCTION fn_validar_rol('ADMINISTRADOR');

CREATE TRIGGER trg_validar_rol_organizadores
    BEFORE INSERT ON organizadores
    FOR EACH ROW EXECUTE FUNCTION fn_validar_rol('ORGANIZADOR');

CREATE TRIGGER trg_validar_rol_participantes
    BEFORE INSERT ON participantes
    FOR EACH ROW EXECUTE FUNCTION fn_validar_rol('PARTICIPANTE');

-- TRIGGER 2: el rol de un usuario no puede cambiar una vez creado
-- (evita que quede registrado en la tabla de un rol que ya no tiene)

CREATE OR REPLACE FUNCTION fn_bloquear_cambio_rol()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.rol <> OLD.rol THEN
        RAISE EXCEPTION 'El rol del usuario % no puede modificarse', OLD.id_usuario;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_bloquear_cambio_rol
    BEFORE UPDATE OF rol ON usuarios
    FOR EACH ROW EXECUTE FUNCTION fn_bloquear_cambio_rol();