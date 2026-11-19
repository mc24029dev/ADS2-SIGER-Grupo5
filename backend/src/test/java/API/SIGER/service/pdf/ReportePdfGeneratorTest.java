package API.SIGER.service.pdf;


import API.SIGER.DTO.Reporte.ReporteDocumento;
import API.SIGER.DTO.Reporte.ReporteDocumento.Columna;
import API.SIGER.DTO.Reporte.ReporteDocumento.Indicador;
import org.junit.jupiter.api.Test;


import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertTrue;

class ReportePdfGeneratorTest {

    private final ReportePDFGenerator generador = new ReportePDFGenerator();

    @Test
    void generaPdfConVariasPaginas() throws Exception {
        List<List<String>> filas = new ArrayList<>();
        for (int i = 1; i <= 80; i++) {
            filas.add(List.of("RES-2026-" + String.format("%04d", i),
                    "Participante Ñandú Número " + i,
                    "Congreso de Ingeniería de Software 2026",
                    "17/11/2026",
                    i % 3 == 0 ? "Cancelada" : "Confirmada"));
        }

        ReporteDocumento doc = new ReporteDocumento(
                "Reporte de Reservaciones",
                "Carlos Alberto Mejía Rivas",
                LocalDateTime.now(),
                List.of("Evento: todos", "Desde: 01/10/2026"),
                List.of(new Indicador("Confirmadas", "54"), new Indicador("Canceladas", "26")),
                List.of(new Columna("Código", 2f), new Columna("Participante", 3f),
                        new Columna("Evento", 4f), new Columna("Fecha", 2f), new Columna("Estado", 2f)),
                filas,
                "Nota de prueba al pie del reporte.");

        byte[] pdf = generador.generar(doc);

        Files.write(Path.of("target/prueba-reporte.pdf"), pdf);
        assertTrue(pdf.length > 1000);
        assertTrue(new String(pdf, 0, 4).equals("%PDF"));
    }

    @Test
    void generaPdfSinFilas() {
        ReporteDocumento doc = new ReporteDocumento(
                "Reporte vacío", "Admin", LocalDateTime.now(),
                List.of(), List.of(), List.of(new Columna("Código", 1f)), List.of(), null);

        assertTrue(generador.generar(doc).length > 500);
    }
}