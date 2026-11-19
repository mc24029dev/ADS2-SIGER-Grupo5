package API.SIGER.DTO.Evento;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

/** Datos que el Organizador puede enviar al crear o modificar un evento. */
public record EventoRequestDTO(

        @NotBlank(message = "El nombre es obligatorio")
        @Size(max = 150, message = "El nombre no debe superar los 150 caracteres")
        String nombre,

        @NotNull(message = "La fecha es obligatoria")
        LocalDateTime fecha,

        @NotNull(message = "La ubicación es obligatoria")
        Integer idUbicacion,

        @NotNull(message = "La capacidad máxima es obligatoria")
        @Min(value = 1, message = "La capacidad máxima debe ser mayor que 0")
        Integer capacidadMaxima,

        @Size(max = 300, message = "La descripción no debe superar los 300 caracteres")
        String descripcion
) {
}
