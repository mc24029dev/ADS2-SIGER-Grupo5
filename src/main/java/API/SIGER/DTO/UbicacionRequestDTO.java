
package API.SIGER.DTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UbicacionRequestDTO(

        @NotBlank(message = "El lugar es obligatorio")
        @Size(max = 100, message = "El lugar no debe superar los 100 caracteres")
        String lugar,

        @NotBlank(message = "La sede es obligatoria")
        @Size(max = 100, message = "La sede no debe superar los 100 caracteres")
        String sede

) {}