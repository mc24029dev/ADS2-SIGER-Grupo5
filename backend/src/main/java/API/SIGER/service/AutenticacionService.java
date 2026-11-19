package API.SIGER.service;

import API.SIGER.DTO.Auth.RegistroRequestDTO;
import API.SIGER.DTO.Auth.UsuarioResponseDTO;

public interface AutenticacionService {

    UsuarioResponseDTO registrarParticipante(RegistroRequestDTO request);

    UsuarioResponseDTO obtenerPerfil(String email);
}