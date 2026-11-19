package API.SIGER.DTO.Reporte;

import java.time.LocalDateTime;
import java.util.List;

public record ReporteDocumento(
        String titulo,
        String generadoPor,
        LocalDateTime fechaGeneracion,
        List<String> filtros,
        List<Indicador> resumen,
        List<Columna> columnas,
        List<List<String>> filas,
        String nota
) {
    public record Indicador(String etiqueta, String valor) {}

    public record Columna(String titulo, float peso) {}
}