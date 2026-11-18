package API.SIGER.DTO;

import API.SIGER.persistence.entity.Ubicacion;

public record UbicacionResponse(
        Integer idUbicacion,
        String lugar,
        String sede
) {
    public static UbicacionResponse desde(Ubicacion u) {
        return new UbicacionResponse(
                u.getIdUbicacion(),
                u.getLugar(),
                u.getSede()
        );
    }
}