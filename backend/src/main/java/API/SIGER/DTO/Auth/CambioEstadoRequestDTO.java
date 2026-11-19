package API.SIGER.DTO.Auth;

import jakarta.validation.constraints.NotNull;

public record CambioEstadoRequestDTO(
        @NotNull
        Boolean estado
) {}