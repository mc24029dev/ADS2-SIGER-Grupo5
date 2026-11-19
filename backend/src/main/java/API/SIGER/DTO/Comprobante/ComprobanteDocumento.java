package API.SIGER.DTO.Comprobante;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record ComprobanteDocumento(
        String codigo,
        String evento,
        LocalDateTime fechaEvento,
        String lugar,
        String participante,
        String correo,
        LocalDate fechaReservacion,
        String estado
) {}