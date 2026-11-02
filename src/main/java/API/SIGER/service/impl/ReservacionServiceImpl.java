package API.SIGER.service.impl;

import API.SIGER.DTO.ReservacionRequest;
import API.SIGER.DTO.ReservacionResponse;
import API.SIGER.exception.RecursoNoEncontradoException;
import API.SIGER.exception.ReglaNegocioException;
import API.SIGER.persistence.entity.Evento;
import API.SIGER.persistence.entity.Participante;
import API.SIGER.persistence.entity.Reservacion;
import API.SIGER.persistence.enums.EstadoEvento;
import API.SIGER.persistence.enums.EstadoReservacion;
import API.SIGER.repository.EventoRepository;
import API.SIGER.repository.ParticipanteRepository;
import API.SIGER.repository.ReservacionRepository;
import API.SIGER.service.ReservacionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.Year;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ReservacionServiceImpl implements ReservacionService {

    private final EventoRepository eventoRepository;
    private final ParticipanteRepository participanteRepository;
    private final ReservacionRepository reservacionRepository;

    // Todo ocurre en una sola transacción: si algo falla, no se guarda la
    // reservación ni se descuenta el cupo.
    @Override
    @Transactional
    public ReservacionResponse reservar(ReservacionRequest request) {
        // 1. Se bloquea el evento: nadie más puede reservar en él hasta terminar.
        Evento evento = eventoRepository.buscarConBloqueo(request.idEvento())
                .orElseThrow(() -> new RecursoNoEncontradoException("El evento no existe"));

        Participante participante = participanteRepository.findById(request.idParticipante())
                .orElseThrow(() -> new RecursoNoEncontradoException("El participante no existe"));

        // 2. Reglas de negocio (los mensajes son los definidos en el caso de uso).
        if (!Boolean.TRUE.equals(participante.getEstado())) {
            throw new ReglaNegocioException("La cuenta del participante está inactiva");
        }
        if (evento.getEstado() != EstadoEvento.Activo) {
            throw new ReglaNegocioException("El evento no está disponible para reservaciones");
        }
        if (evento.getCupoDisponible() <= 0) {
            throw new ReglaNegocioException("No hay cupos disponibles para este evento");
        }
        if (reservacionRepository.existsByEvento_IdEventoAndParticipante_IdUsuarioAndEstadoNot(
                evento.getIdEvento(), participante.getIdUsuario(), EstadoReservacion.Cancelada)) {
            throw new ReglaNegocioException("Ya cuentas con una reservación registrada para este evento");
        }

        // 3. Se registra la reservación con su código único.
        Reservacion reservacion = new Reservacion();
        reservacion.setFechaReservacion(LocalDate.now());
        reservacion.setCodigoReservacion(generarCodigo());
        reservacion.setEstado(EstadoReservacion.Confirmada);
        reservacion.setEvento(evento);
        reservacion.setParticipante(participante);
        reservacionRepository.save(reservacion);

        // 4. Se descuenta el cupo (se guarda al finalizar la transacción).
        evento.setCupoDisponible(evento.getCupoDisponible() - 1);

        return ReservacionResponse.desde(reservacion);
    }

    @Override
    @Transactional
    public ReservacionResponse cancelar(Integer idReservacion) {
        Reservacion reservacion = reservacionRepository.findById(idReservacion)
                .orElseThrow(() -> new RecursoNoEncontradoException("La reservación no existe"));

        if (reservacion.getEstado() == EstadoReservacion.Cancelada) {
            throw new ReglaNegocioException("Esta reservación ya se encuentra cancelada");
        }

        // Se bloquea el evento antes de modificar su cupo.
        Evento evento = eventoRepository.buscarConBloqueo(reservacion.getEvento().getIdEvento())
                .orElseThrow(() -> new RecursoNoEncontradoException("El evento no existe"));

        if (evento.getEstado() == EstadoEvento.Finalizado) {
            throw new ReglaNegocioException("No es posible cancelar una reservación de un evento ya finalizado");
        }

        reservacion.setEstado(EstadoReservacion.Cancelada);
        evento.setCupoDisponible(evento.getCupoDisponible() + 1);

        return ReservacionResponse.desde(reservacion);
    }

    // Ejemplo: RES-2026-3F9A1C2B
    private String generarCodigo() {
        return "RES-" + Year.now().getValue() + "-"
                + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
}
