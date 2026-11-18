package API.SIGER.service;

import API.SIGER.DTO.OrganizadorRequestDTO;
import API.SIGER.DTO.OrganizadorResponseDTO;

import java.util.List;

public interface OrganizadorService {

    List<OrganizadorResponseDTO> listar();

    OrganizadorResponseDTO buscarPorId(Integer idOrganizador);

    OrganizadorResponseDTO registrar(OrganizadorRequestDTO request);

    OrganizadorResponseDTO actualizar(Integer idOrganizador, OrganizadorRequestDTO request);

    void eliminar(Integer idOrganizador);
}