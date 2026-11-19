package API.SIGER.service;

import API.SIGER.DTO.Evento.EventoRequestDTO;
import API.SIGER.DTO.EventoResponse;
import API.SIGER.persistence.enums.EstadoEvento;

import java.util.List;

public interface EventoService {

    List<EventoResponse> listar();

    EventoResponse crear(EventoRequestDTO request, String emailOrganizador);

    EventoResponse actualizar(Integer idEvento, EventoRequestDTO request, String emailOrganizador);

    EventoResponse cambiarEstado(Integer idEvento, EstadoEvento nuevoEstado, String emailOrganizador);
}


