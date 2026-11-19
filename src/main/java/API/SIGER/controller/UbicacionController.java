package API.SIGER.controller;

import API.SIGER.DTO.Ubicacion.UbicacionRequestDTO;
import API.SIGER.DTO.Ubicacion.UbicacionResponseDTO;
import API.SIGER.service.UbicacionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/ubicaciones")
@RequiredArgsConstructor
public class UbicacionController {

    private final UbicacionService ubicacionService;

    @GetMapping
    public List<UbicacionResponseDTO> listar() {
        return ubicacionService.listar();
    }

    @GetMapping("/{id}")
    public UbicacionResponseDTO buscarPorId(@PathVariable Integer id) {
        return ubicacionService.buscarPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public UbicacionResponseDTO crear(@Valid @RequestBody UbicacionRequestDTO request) {
        return ubicacionService.crear(request);
    }

    @PutMapping("/{id}")
    public UbicacionResponseDTO actualizar(@PathVariable Integer id,
                                           @Valid @RequestBody UbicacionRequestDTO request) {
        return ubicacionService.actualizar(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Integer id) {
        ubicacionService.eliminar(id);
    }
}
