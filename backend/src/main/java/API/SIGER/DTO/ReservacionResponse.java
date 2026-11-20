package API.SIGER.DTO;

import API.SIGER.persistence.entity.Reservacion;
import API.SIGER.persistence.enums.EstadoReservacion;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record ReservacionResponse(
        Integer idReservacion,
        String codigoReservacion,
        EstadoReservacion estado,
        LocalDate fechaReservacion,
        LocalDateTime fechaEvento,
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
                r.getEvento().getFecha(),
                r.getEvento().getIdEvento(),
                r.getEvento().getNombre(),
                r.getEvento().getCupoDisponible());
    }
}
