package API.SIGER.service;

import API.SIGER.DTO.Auth.PasswordRequestDTO;
import API.SIGER.DTO.Auth.PerfilRequestDTO;
import API.SIGER.DTO.Auth.RegistroRequestDTO;
import API.SIGER.DTO.Auth.UsuarioResponseDTO;

public interface AutenticacionService {

    UsuarioResponseDTO registrarParticipante(RegistroRequestDTO request);

    UsuarioResponseDTO obtenerPerfil(String email);

    UsuarioResponseDTO actualizarPerfil(String email, PerfilRequestDTO request);
    void cambiarPassword(String email, PasswordRequestDTO request);
}