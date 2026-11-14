package API.SIGER.exception.asistencia;

import API.SIGER.exception.ReglaNegocioException;

public class AsistenciaYaRegistradaException extends ReglaNegocioException {

    private static final long serialVersionUID = 1L;

    public AsistenciaYaRegistradaException() {
        super("La asistencia de este participante ya fue registrada");
    }
}