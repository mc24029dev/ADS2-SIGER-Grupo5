package API.SIGER.DTO.Auth;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record PasswordRequestDTO(
        @NotBlank(message = "La contraseña actual es obligatoria") String contrasenaActual,
        @NotBlank(message = "La nueva contraseña es obligatoria") 
        @Size(min = 8, max = 72, message = "La contraseña debe tener entre 8 y 72 caracteres") 
        String nuevaContrasena
) {}