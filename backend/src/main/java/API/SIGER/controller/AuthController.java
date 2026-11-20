package API.SIGER.controller;

import API.SIGER.DTO.Auth.PasswordRequestDTO;
import API.SIGER.DTO.Auth.PerfilRequestDTO;
import API.SIGER.DTO.Auth.RegistroRequestDTO;
import API.SIGER.DTO.Auth.UsuarioResponseDTO;
import API.SIGER.DTO.Auth.PerfilRequestDTO;
import API.SIGER.DTO.Auth.PasswordRequestDTO;
import API.SIGER.service.AutenticacionService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@AllArgsConstructor
public class AuthController {

    private final AutenticacionService autenticacionService;

    @PostMapping("/registro")
    public ResponseEntity<UsuarioResponseDTO> registrar(@Valid @RequestBody RegistroRequestDTO request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(autenticacionService.registrarParticipante(request));
    }

    @GetMapping("/me")
    public UsuarioResponseDTO perfil(Authentication authentication) {
        return autenticacionService.obtenerPerfil(authentication.getName());
    }

    @PutMapping("/me/perfil")
    public UsuarioResponseDTO actualizarPerfil(@Valid @RequestBody PerfilRequestDTO request, Authentication auth) {
        return autenticacionService.actualizarPerfil(auth.getName(), request);
    }

    @PutMapping("/me/password")
    public ResponseEntity<String> cambiarPassword(@Valid @RequestBody PasswordRequestDTO request, Authentication auth) {
        autenticacionService.cambiarPassword(auth.getName(), request);
        return ResponseEntity.ok("{\"mensaje\": \"Contraseña actualizada correctamente\"}");
    }
}