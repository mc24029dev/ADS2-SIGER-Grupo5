package API.SIGER.exception.asistencia;

import API.SIGER.exception.AccesoDenegadoException;

public class AccesoEventoDenegadoException extends AccesoDenegadoException {

  private static final long serialVersionUID = 1L;

  public AccesoEventoDenegadoException() {
    super("No tienes permiso para gestionar la asistencia de este evento");
  }
}