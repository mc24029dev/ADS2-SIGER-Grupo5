package API.SIGER.controller;

import API.SIGER.DTO.UbicacionRequestDTO;
import API.SIGER.DTO.UbicacionResponse;
import API.SIGER.service.UbicacionService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/ubicaciones")
@RequiredArgsConstructor
public class UbicacionController {

    private final UbicacionService ubicacionService;

    @GetMapping
    public List<UbicacionResponse> listar() {
        return ubicacionService.listar();
    }

    @GetMapping("/{idUbicacion}")
    public UbicacionResponse buscarPorId(@PathVariable Integer idUbicacion) {
        return ubicacionService.buscarPorId(idUbicacion);
    }

    @PostMapping
    public UbicacionResponse registrar(
            @Valid @RequestBody UbicacionRequestDTO request) {
        return ubicacionService.registrar(request);
    }

    @PutMapping("/{idUbicacion}")
    public UbicacionResponse actualizar(
            @PathVariable Integer idUbicacion,
            @Valid @RequestBody UbicacionRequestDTO request) {
        return ubicacionService.actualizar(idUbicacion, request);
    }

    @DeleteMapping("/{idUbicacion}")
    public void eliminar(@PathVariable Integer idUbicacion) {
        ubicacionService.eliminar(idUbicacion);
    }
}