package API.SIGER.listener;

import API.SIGER.event.NotificacionEvent;
import API.SIGER.service.NotificacionService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Component
@RequiredArgsConstructor
public class NotificacionListener {

    private final NotificacionService notificacionService;

    @Async
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void alRecibirNotificacion(NotificacionEvent evento) {
        notificacionService.enviar(evento);
    }
}
