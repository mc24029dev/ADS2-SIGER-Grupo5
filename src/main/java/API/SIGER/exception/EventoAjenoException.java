package API.SIGER.exception;

public class EventoAjenoException extends AccesoDenegadoException {

    private static final long serialVersionUID = 1L;

    public EventoAjenoException() {
        super("Solo el organizador que creó el evento puede modificarlo");
    }
}
