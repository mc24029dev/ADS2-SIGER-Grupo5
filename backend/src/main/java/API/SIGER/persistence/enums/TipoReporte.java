package API.SIGER.persistence.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum TipoReporte {
    ASISTENCIA("Asistencia"),
    EVENTOS("Eventos"),
    USUARIOS("Usuarios"),
    RESERVACIONES("Reservaciones");

    private final String etiqueta;
}