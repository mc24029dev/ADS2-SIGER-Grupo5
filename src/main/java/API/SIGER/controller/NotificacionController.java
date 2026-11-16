package API.SIGER.controller;

import API.SIGER.DTO.NotificacionResponse;
import API.SIGER.service.NotificacionService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/notificaciones")
@RequiredArgsConstructor
public class NotificacionController {

    private final NotificacionService notificacionService;

    @GetMapping
    public List<NotificacionResponse> listarMias(Authentication authentication) {
        return notificacionService.listarDelUsuario(authentication.getName());
    }
}
