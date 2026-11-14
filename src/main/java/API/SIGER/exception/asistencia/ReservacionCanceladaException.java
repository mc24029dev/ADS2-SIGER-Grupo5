package API.SIGER.exception.asistencia;

import API.SIGER.exception.ReglaNegocioException;

public class ReservacionCanceladaException extends ReglaNegocioException {

    private static final long serialVersionUID = 1L;

    public ReservacionCanceladaException() {
        super("La reservación se encuentra cancelada");
    }
}