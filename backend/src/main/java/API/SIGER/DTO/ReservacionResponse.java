package API.SIGER.DTO;

import API.SIGER.persistence.entity.Reservacion;
import API.SIGER.persistence.enums.EstadoReservacion;

import java.time.LocalDate;

public record ReservacionResponse(
        Integer idReservacion,
        String codigoReservacion,
        EstadoReservacion estado,
        LocalDate fechaReservacion,
        Integer idEvento,
        String nombreEvento,
        Integer cupoDisponible
) {
    public static ReservacionResponse desde(Reservacion r) {
        return new ReservacionResponse(
                r.getIdReservacion(),
                r.getCodigoReservacion(),
                r.getEstado(),
                r.getFechaReservacion(),
                r.getEvento().getIdEvento(),
                r.getEvento().getNombre(),
                r.getEvento().getCupoDisponible());
    }
}
