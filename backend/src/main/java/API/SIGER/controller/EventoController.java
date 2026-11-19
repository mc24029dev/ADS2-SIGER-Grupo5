package API.SIGER.controller;

import API.SIGER.DTO.Evento.CambioEstadoEventoRequestDTO;
import API.SIGER.DTO.Evento.EventoRequestDTO;
import API.SIGER.DTO.EventoResponse;
import API.SIGER.service.EventoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/eventos")
@RequiredArgsConstructor
public class EventoController {

    private final EventoService eventoService;

    @GetMapping
    public List<EventoResponse> listar() {
        return eventoService.listar();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public EventoResponse crear(@Valid @RequestBody EventoRequestDTO request, Authentication auth) {
        return eventoService.crear(request, auth.getName());
    }

    @PutMapping("/{id}")
    public EventoResponse actualizar(@PathVariable Integer id,
                                     @Valid @RequestBody EventoRequestDTO request,
                                     Authentication auth) {
        return eventoService.actualizar(id, request, auth.getName());
    }

    @PatchMapping("/{id}/estado")
    public EventoResponse cambiarEstado(@PathVariable Integer id,
                                        @Valid @RequestBody CambioEstadoEventoRequestDTO request,
                                        Authentication auth) {
        return eventoService.cambiarEstado(id, request.estado(), auth.getName());
    }
}
