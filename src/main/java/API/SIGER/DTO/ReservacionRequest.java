package API.SIGER.DTO;

import jakarta.validation.constraints.NotNull;

public record ReservacionRequest(
        @NotNull(message = "El evento es obligatorio") Integer idEvento,
        @NotNull(message = "El participante es obligatorio") Integer idParticipante
) {
}
