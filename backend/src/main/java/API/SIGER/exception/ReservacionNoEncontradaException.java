package API.SIGER.exception;

public class ReservacionNoEncontradaException extends RecursoNoEncontradoException {

    private static final long serialVersionUID = 1L;

    public ReservacionNoEncontradaException() {
        super("La reservación no existe");
    }
}