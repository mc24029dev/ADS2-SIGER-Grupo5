package API.SIGER.DTO.Asistencia;

import java.time.LocalDateTime;

public record AsistenciaResponseDTO(

        Integer idReservacion,
        String codigoReservacion,
        String nombres,
        String apellidos,
        boolean asistio,
        LocalDateTime fechaRegistro // null si aun no asistio
) {
}