package API.SIGER.exception;

public class EventoSinRegistroAsistenciaException extends ReglaNegocioException {

    private static final long serialVersionUID = 1L;

    public EventoSinRegistroAsistenciaException() {
        super("El evento no admite el registro de asistencia");
    }
}