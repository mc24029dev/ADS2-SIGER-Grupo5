package API.SIGER.service;

import API.SIGER.DTO.Ubicacion.UbicacionRequestDTO;
import API.SIGER.DTO.Ubicacion.UbicacionResponseDTO;

import java.util.List;

public interface UbicacionService {

    List<UbicacionResponseDTO> listar();

    UbicacionResponseDTO buscarPorId(Integer idUbicacion);

    UbicacionResponseDTO crear(UbicacionRequestDTO request);

    UbicacionResponseDTO actualizar(Integer idUbicacion, UbicacionRequestDTO request);

    void eliminar(Integer idUbicacion);
}
