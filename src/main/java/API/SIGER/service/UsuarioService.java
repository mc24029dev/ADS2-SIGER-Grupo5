package API.SIGER.service;

import API.SIGER.DTO.Auth.RegistroRequestDTO;
import API.SIGER.DTO.Auth.UsuarioResponseDTO;

import java.util.List;

public interface UsuarioService {

    UsuarioResponseDTO crearOrganizador(RegistroRequestDTO request, String emailAdministrador);

    UsuarioResponseDTO crearAdministrador(RegistroRequestDTO request, String emailAdministrador);

    List<UsuarioResponseDTO> listar();

    UsuarioResponseDTO cambiarEstado(Integer idUsuario, boolean estado, String emailAdministrador);
}