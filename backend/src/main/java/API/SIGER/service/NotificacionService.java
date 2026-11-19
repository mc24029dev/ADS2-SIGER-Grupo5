package API.SIGER.service;

import API.SIGER.DTO.NotificacionResponse;
import API.SIGER.event.NotificacionEvent;

import java.util.List;

public interface NotificacionService {

    void enviar(NotificacionEvent evento);

    List<NotificacionResponse> listarDelUsuario(String email);
}

