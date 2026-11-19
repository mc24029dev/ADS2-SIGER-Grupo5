package API.SIGER.DTO.Evento;

import API.SIGER.persistence.enums.EstadoEvento;
import jakarta.validation.constraints.NotNull;

public record CambioEstadoEventoRequestDTO(
        @NotNull(message = "El estado es obligatorio")
        EstadoEvento estado
) {
}
