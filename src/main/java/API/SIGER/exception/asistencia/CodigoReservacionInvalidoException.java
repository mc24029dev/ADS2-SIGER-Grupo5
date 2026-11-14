package API.SIGER.exception.asistencia;

import API.SIGER.exception.RecursoNoEncontradoException;

public class CodigoReservacionInvalidoException extends RecursoNoEncontradoException {

    private static final long serialVersionUID = 1L;

    public CodigoReservacionInvalidoException() {
        super("El código de reservación no es válido");
    }
}