package API.SIGER.controller;

import API.SIGER.DTO.OrganizadorRequestDTO;
import API.SIGER.DTO.OrganizadorResponseDTO;
import API.SIGER.service.OrganizadorService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/organizadores")
@RequiredArgsConstructor
public class OrganizadorController {

    private final OrganizadorService organizadorService;

    @GetMapping
    public List<OrganizadorResponseDTO> listar() {
        return organizadorService.listar();
    }

    @GetMapping("/{idOrganizador}")
    public OrganizadorResponseDTO buscarPorId(
            @PathVariable Integer idOrganizador) {
        return organizadorService.buscarPorId(idOrganizador);
    }

    @PostMapping
    public OrganizadorResponseDTO registrar(
            @Valid @RequestBody OrganizadorRequestDTO request) {
        return organizadorService.registrar(request);
    }

    @PutMapping("/{idOrganizador}")
    public OrganizadorResponseDTO actualizar(
            @PathVariable Integer idOrganizador,
            @Valid @RequestBody OrganizadorRequestDTO request) {
        return organizadorService.actualizar(idOrganizador, request);
    }

    @DeleteMapping("/{idOrganizador}")
    public void eliminar(@PathVariable Integer idOrganizador) {
        organizadorService.eliminar(idOrganizador);
    }
}