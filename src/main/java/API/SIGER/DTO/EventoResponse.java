package API.SIGER.DTO;

import API.SIGER.persistence.entity.Evento;
import API.SIGER.persistence.enums.EstadoEvento;

import java.time.LocalDateTime;

public record EventoResponse(
        Integer idEvento,
        String nombre,
        LocalDateTime fecha,
        String lugar,
        String sede,
        Integer capacidadMaxima,
        Integer cupoDisponible,
        EstadoEvento estado
) {
    public static EventoResponse desde(Evento e) {
        return new EventoResponse(
                e.getIdEvento(),
                e.getNombre(),
                e.getFecha(),
                e.getUbicacion().getLugar(),
                e.getUbicacion().getSede(),
                e.getCapacidadMaxima(),
                e.getCupoDisponible(),
                e.getEstado());
    }
}
