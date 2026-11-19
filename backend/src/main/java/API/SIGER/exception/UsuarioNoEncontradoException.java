package API.SIGER.exception;

public class UsuarioNoEncontradoException extends RecursoNoEncontradoException {

  private static final long serialVersionUID = 1L;

  public UsuarioNoEncontradoException(Integer idUsuario) {
    super("No existe un usuario con id " + idUsuario);
  }
}