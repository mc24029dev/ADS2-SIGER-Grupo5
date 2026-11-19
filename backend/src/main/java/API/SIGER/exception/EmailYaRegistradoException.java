package API.SIGER.exception;

public class EmailYaRegistradoException extends ReglaNegocioException {

    private static final long serialVersionUID = 1L;

    public EmailYaRegistradoException() {
        super("Ya existe una cuenta con ese correo");
    }
}