package API.SIGER.controller;

import API.SIGER.DTO.ReservacionRequest;
import API.SIGER.DTO.ReservacionResponse;
import API.SIGER.service.ReservacionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/reservaciones")
@RequiredArgsConstructor
public class ReservacionController {

    private final ReservacionService reservacionService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ReservacionResponse reservar(@Valid @RequestBody ReservacionRequest request) {
        return reservacionService.reservar(request);
    }

    @PatchMapping("/{id}/cancelar")
    public ReservacionResponse cancelar(@PathVariable Integer id) {
        return reservacionService.cancelar(id);
    }
}

