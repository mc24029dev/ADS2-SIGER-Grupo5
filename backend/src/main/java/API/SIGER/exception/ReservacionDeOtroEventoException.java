package API.SIGER.exception;

public class ReservacionDeOtroEventoException extends ReglaNegocioException {

    private static final long serialVersionUID = 1L;

    public ReservacionDeOtroEventoException() {
        super("La reservación no corresponde a este evento");
    }
}