package API.SIGER.exception;

public class EventoNoEncontradoException extends RecursoNoEncontradoException {

    private static final long serialVersionUID = 1L;

    public EventoNoEncontradoException() {
        super("El evento no existe");
    }
}