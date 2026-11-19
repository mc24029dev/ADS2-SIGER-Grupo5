package API.SIGER.exception;

public class AutoDesactivacionException extends ReglaNegocioException {

    private static final long serialVersionUID = 1L;

    public AutoDesactivacionException() {
        super("No puedes desactivar tu propia cuenta");
    }
}