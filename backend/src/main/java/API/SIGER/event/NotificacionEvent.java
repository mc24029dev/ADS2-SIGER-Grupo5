package API.SIGER.event;

import API.SIGER.persistence.enums.TipoNotificacion;

import java.time.LocalDateTime;

public record NotificacionEvent(
        Integer idUsuario,
        String nombreDestinatario,
        String emailDestino,
        TipoNotificacion tipo,
        String nombreEvento,
        LocalDateTime fechaEvento,
        String codigoReservacion
) {
}
