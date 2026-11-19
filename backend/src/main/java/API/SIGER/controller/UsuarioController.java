package API.SIGER.controller;

import API.SIGER.DTO.Auth.CambioEstadoRequestDTO;
import API.SIGER.DTO.Auth.RegistroRequestDTO;
import API.SIGER.DTO.Auth.UsuarioResponseDTO;
import API.SIGER.service.UsuarioService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/usuarios")
@AllArgsConstructor
public class UsuarioController {

    private final UsuarioService usuarioService;

    @PostMapping("/organizadores")
    public ResponseEntity<UsuarioResponseDTO> crearOrganizador(
            @Valid @RequestBody RegistroRequestDTO request, Authentication authentication) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(usuarioService.crearOrganizador(request, authentication.getName()));
    }

    @PostMapping("/administradores")
    public ResponseEntity<UsuarioResponseDTO> crearAdministrador(
            @Valid @RequestBody RegistroRequestDTO request, Authentication authentication) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(usuarioService.crearAdministrador(request, authentication.getName()));
    }

    @GetMapping
    public List<UsuarioResponseDTO> listar() {
        return usuarioService.listar();
    }

    @PatchMapping("/{idUsuario}/estado")
    public UsuarioResponseDTO cambiarEstado(
            @PathVariable Integer idUsuario,
            @Valid @RequestBody CambioEstadoRequestDTO request,
            Authentication authentication) {
        return usuarioService.cambiarEstado(idUsuario, request.estado(), authentication.getName());
    }
}