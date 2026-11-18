package API.SIGER.service;

import API.SIGER.DTO.UbicacionRequestDTO;
import API.SIGER.DTO.UbicacionResponse;

import java.util.List;

public interface UbicacionService {

    List<UbicacionResponse> listar();

    UbicacionResponse buscarPorId(Integer idUbicacion);

    UbicacionResponse registrar(UbicacionRequestDTO request);

    UbicacionResponse actualizar(Integer idUbicacion, UbicacionRequestDTO request);

    void eliminar(Integer idUbicacion);
}