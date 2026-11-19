package API.SIGER.service;

import API.SIGER.DTO.Asistencia.AsistenciaResponseDTO;

import java.util.List;

public interface AsistenciaService {

    AsistenciaResponseDTO registrarPorCodigo(Integer idEvento, String codigo, String emailOrganizador);

    AsistenciaResponseDTO registrarPorReservacion(Integer idEvento, Integer idReservacion, String emailOrganizador);

    List<AsistenciaResponseDTO> listarPorEvento(Integer idEvento, String emailOrganizador);

    List<AsistenciaResponseDTO> buscarPorEvento(Integer idEvento, String texto, String emailOrganizador);
}