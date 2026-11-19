package API.SIGER.controller;

import API.SIGER.DTO.Reporte.FiltroReporte;
import API.SIGER.persistence.enums.EstadoEvento;
import API.SIGER.service.ReporteService;
import lombok.AllArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;

@RestController
@RequestMapping("/reportes")
@AllArgsConstructor
public class ReporteController {

    private final ReporteService reporteService;

    @GetMapping("/asistencia")
    public ResponseEntity<byte[]> asistencia(@RequestParam Integer idEvento, Authentication auth) {
        return pdf(reporteService.reporteAsistencia(idEvento, auth.getName()), "asistencia");
    }

    @GetMapping("/eventos")
    public ResponseEntity<byte[]> eventos(
            @RequestParam(required = false) EstadoEvento estado,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate desde,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate hasta,
            Authentication auth) {
        FiltroReporte filtro = new FiltroReporte(null, estado, desde, hasta);
        return pdf(reporteService.reporteEventos(filtro, auth.getName()), "eventos");
    }

    @GetMapping("/usuarios")
    public ResponseEntity<byte[]> usuarios(Authentication auth) {
        return pdf(reporteService.reporteUsuarios(auth.getName()), "usuarios");
    }

    @GetMapping("/reservaciones")
    public ResponseEntity<byte[]> reservaciones(
            @RequestParam(required = false) Integer idEvento,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate desde,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate hasta,
            Authentication auth) {
        FiltroReporte filtro = new FiltroReporte(idEvento, null, desde, hasta);
        return pdf(reporteService.reporteReservaciones(filtro, auth.getName()), "reservaciones");
    }

    private ResponseEntity<byte[]> pdf(byte[] contenido, String nombre) {
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        ContentDisposition.attachment().filename("reporte-" + nombre + ".pdf").build().toString())
                .body(contenido);
    }
}

