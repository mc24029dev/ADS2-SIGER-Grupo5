package API.SIGER.exception.asistencia;

import API.SIGER.exception.ReglaNegocioException;

public class ReservacionNoConfirmadaException extends ReglaNegocioException {

    private static final long serialVersionUID = 1L;

    public ReservacionNoConfirmadaException() {
        super("La reservación aún no está confirmada");
    }
}