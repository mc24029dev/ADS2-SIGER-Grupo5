package API.SIGER.service.impl;

import API.SIGER.DTO.NotificacionResponse;
import API.SIGER.event.NotificacionEvent;
import API.SIGER.persistence.entity.Notificacion;
import API.SIGER.repository.NotificacionRepository;
import API.SIGER.repository.UsuarioRepository;
import API.SIGER.service.NotificacionService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class NotificacionServiceImpl implements NotificacionService {

    private static final Logger log = LoggerFactory.getLogger(NotificacionServiceImpl.class);

    private static final DateTimeFormatter FORMATO_FECHA =
            DateTimeFormatter.ofPattern("d 'de' MMMM 'de' yyyy, HH:mm", Locale.forLanguageTag("es-SV"));

    private final JavaMailSender mailSender;
    private final NotificacionRepository notificacionRepository;
    private final UsuarioRepository usuarioRepository;

    @Value("${siger.mail.remitente:no-reply@siger.edu.sv}")
    private String remitente;

    @Override
    public void enviar(NotificacionEvent evento) {
        String mensaje = construirMensaje(evento);

        try {
            SimpleMailMessage correo = new SimpleMailMessage();
            correo.setFrom(remitente);
            correo.setTo(evento.emailDestino());
            correo.setSubject(construirAsunto(evento));
            correo.setText("Hola " + evento.nombreDestinatario() + ",\n\n" + mensaje
                    + "\n\nSIGER - Sistema Inteligente de Gestión de Eventos y Reservaciones");
            mailSender.send(correo);
        } catch (MailException e) {
            log.error("No se pudo enviar el correo de tipo {} a {}: {}",
                    evento.tipo(), evento.emailDestino(), e.getMessage());
            return;
        }

        Notificacion notificacion = new Notificacion();
        notificacion.setMensaje(mensaje);
        notificacion.setTipo(evento.tipo());
        notificacion.setFechaEnvio(LocalDateTime.now());
        notificacion.setUsuario(usuarioRepository.getReferenceById(evento.idUsuario()));
        notificacionRepository.save(notificacion);

        log.info("Notificación {} enviada a {}", evento.tipo(), evento.emailDestino());
    }

    @Override
    @Transactional(readOnly = true)
    public List<NotificacionResponse> listarDelUsuario(String email) {
        return notificacionRepository.findByUsuario_EmailOrderByFechaEnvioDesc(email).stream()
                .map(NotificacionResponse::desde)
                .toList();
    }

    private String construirAsunto(NotificacionEvent e) {
        return switch (e.tipo()) {
            case CONFIRMACION -> "SIGER - Reservación confirmada";
            case CANCELACION -> "SIGER - Reservación cancelada";
            case RECORDATORIO -> "SIGER - Recordatorio de evento";
        };
    }

    private String construirMensaje(NotificacionEvent e) {
        String fecha = FORMATO_FECHA.format(e.fechaEvento());
        String mensaje = switch (e.tipo()) {
            case CONFIRMACION -> "Tu reservación " + e.codigoReservacion() + " al evento \""
                    + e.nombreEvento() + "\" fue confirmada. Se realizará el " + fecha
                    + ". Presenta tu código al ingresar.";
            case CANCELACION -> "Tu reservación " + e.codigoReservacion() + " al evento \""
                    + e.nombreEvento() + "\" fue cancelada. Tu cupo quedó liberado.";
            case RECORDATORIO -> "Recordatorio: el evento \"" + e.nombreEvento()
                    + "\" se realizará el " + fecha + ".";
        };
        return mensaje.length() > 300 ? mensaje.substring(0, 300) : mensaje;
    }
}

