package API.SIGER.controller;

import API.SIGER.DTO.Asistencia.AsistenciaResponseDTO;
import API.SIGER.DTO.Asistencia.RegistroAsistenciaRequestDTO;
import API.SIGER.service.AsistenciaService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/eventos/{idEvento}/asistencias")
@AllArgsConstructor
public class AsistenciaController {

    private final AsistenciaService asistenciaService;

    @GetMapping
    public List<AsistenciaResponseDTO> listar(@PathVariable Integer idEvento,
                                              Authentication authentication) {
        return asistenciaService.listarPorEvento(idEvento, authentication.getName());
    }

    @GetMapping("/buscar")
    public List<AsistenciaResponseDTO> buscar(@PathVariable Integer idEvento,
                                              @RequestParam String texto,
                                              Authentication authentication) {
        return asistenciaService.buscarPorEvento(idEvento, texto, authentication.getName());
    }

    // QR o código digitado a mano
    @PostMapping("/codigo")
    public AsistenciaResponseDTO registrarPorCodigo(@PathVariable Integer idEvento,
                                                    @Valid @RequestBody RegistroAsistenciaRequestDTO request,
                                                    Authentication authentication) {
        return asistenciaService.registrarPorCodigo(idEvento, request.codigo(), authentication.getName());
    }

    // Búsqueda manual: el organizador elige al participante del listado
    @PostMapping("/reservaciones/{idReservacion}")
    public AsistenciaResponseDTO registrarPorReservacion(@PathVariable Integer idEvento,
                                                         @PathVariable Integer idReservacion,
                                                         Authentication authentication) {
        return asistenciaService.registrarPorReservacion(idEvento, idReservacion, authentication.getName());
    }
}

