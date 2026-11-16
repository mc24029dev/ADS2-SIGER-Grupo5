package API.SIGER.DTO;

import API.SIGER.persistence.entity.Notificacion;

import java.time.LocalDateTime;

public record NotificacionResponse(
        Integer idNotificacion,
        String tipo,
        String mensaje,
        LocalDateTime fechaEnvio
) {
    public static NotificacionResponse desde(Notificacion n) {
        return new NotificacionResponse(
                n.getIdNotificacion(),
                n.getTipo().getValorBd(),
                n.getMensaje(),
                n.getFechaEnvio());
    }
}
