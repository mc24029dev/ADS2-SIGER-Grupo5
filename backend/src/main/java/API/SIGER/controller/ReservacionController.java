package API.SIGER.controller;

import API.SIGER.DTO.ReservacionRequest;
import API.SIGER.DTO.ReservacionResponse;
import API.SIGER.service.ComprobanteService;
import API.SIGER.service.ReservacionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/reservaciones")
@RequiredArgsConstructor
public class ReservacionController {

    private final ReservacionService reservacionService;
    private final ComprobanteService comprobanteService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ReservacionResponse reservar(@Valid @RequestBody ReservacionRequest request) {
        return reservacionService.reservar(request);
    }

    @PatchMapping("/{id}/cancelar")
    public ReservacionResponse cancelar(@PathVariable Integer id) {
        return reservacionService.cancelar(id);
    }

    @GetMapping("/{id}/comprobante")
    public ResponseEntity<byte[]> comprobante(@PathVariable Integer id, Authentication auth) {
        byte[] pdf = comprobanteService.generar(id, auth.getName());
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        ContentDisposition.attachment().filename("comprobante-" + id + ".pdf").build().toString())
                .body(pdf);
    }
}

