package API.SIGER.DTO.Ubicacion;

import API.SIGER.persistence.entity.Ubicacion;

public record UbicacionResponseDTO(
        Integer idUbicacion,
        String lugar,
        String sede
) {
    public static UbicacionResponseDTO desde(Ubicacion u) {
        return new UbicacionResponseDTO(u.getIdUbicacion(), u.getLugar(), u.getSede());
    }
}
