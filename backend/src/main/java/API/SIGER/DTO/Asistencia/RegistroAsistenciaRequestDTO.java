package API.SIGER.DTO.Asistencia;

import jakarta.validation.constraints.NotBlank;

public record RegistroAsistenciaRequestDTO(

        @NotBlank(message = "El código de reservación es obligatorio")
        String codigo
) {
}
