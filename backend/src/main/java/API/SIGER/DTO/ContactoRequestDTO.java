package API.SIGER.DTO;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record ContactoRequestDTO(
        @NotBlank(message = "El nombre es obligatorio") String nombre,
        @NotBlank(message = "El correo es obligatorio") @Email(message = "Correo inválido") String email,
        @NotBlank(message = "El rol es obligatorio") String rol,
        @NotBlank(message = "El motivo es obligatorio") String motivo
) {}
