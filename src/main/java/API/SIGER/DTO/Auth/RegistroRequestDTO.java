package API.SIGER.DTO.Auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegistroRequestDTO(

        @NotBlank @Size(max = 100)
        String nombres,

        @NotBlank @Size(max = 100)
        String apellidos,

        @NotBlank @Email @Size(max = 150)
        String email,

        @NotBlank @Size(min = 8, max = 72)
        String contrasena
) {}