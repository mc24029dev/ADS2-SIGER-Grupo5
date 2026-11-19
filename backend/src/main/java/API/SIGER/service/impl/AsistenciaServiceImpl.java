package API.SIGER.service.impl;

import API.SIGER.DTO.Asistencia.AsistenciaResponseDTO;
import API.SIGER.exception.*;
import API.SIGER.exception.asistencia.*;
import API.SIGER.persistence.entity.Asistencia;
import API.SIGER.persistence.entity.Evento;
import API.SIGER.persistence.entity.Reservacion;
import API.SIGER.persistence.enums.EstadoEvento;
import API.SIGER.persistence.enums.EstadoReservacion;
import API.SIGER.repository.AsistenciaRepository;
import API.SIGER.repository.EventoRepository;
import API.SIGER.repository.ReservacionRepository;
import API.SIGER.service.AsistenciaService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.Normalizer;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class AsistenciaServiceImpl implements AsistenciaService {

    private final AsistenciaRepository asistenciaRepository;
    private final ReservacionRepository reservacionRepository;
    private final EventoRepository eventoRepository;

    @Override
    @Transactional
    public AsistenciaResponseDTO registrarPorCodigo(Integer idEvento, String codigo, String emailOrganizador) {

        Evento evento = obtenerEventoDelOrganizador(idEvento, emailOrganizador);

        Reservacion reservacion = reservacionRepository
                .findByCodigoReservacion(codigo.trim().toUpperCase())
                .orElseThrow(CodigoReservacionInvalidoException::new);

        return registrar(evento, reservacion);
    }

    @Override
    @Transactional
    public AsistenciaResponseDTO registrarPorReservacion(Integer idEvento, Integer idReservacion, String emailOrganizador) {
        Evento evento = obtenerEventoDelOrganizador(idEvento, emailOrganizador);

        Reservacion reservacion = reservacionRepository.findById(idReservacion)
                .orElseThrow(ReservacionNoEncontradaException::new);

        return registrar(evento, reservacion);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AsistenciaResponseDTO> listarPorEvento(Integer idEvento, String emailOrganizador) {
        obtenerEventoDelOrganizador(idEvento, emailOrganizador);
        return construirListado(idEvento);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AsistenciaResponseDTO> buscarPorEvento(Integer idEvento, String texto, String emailOrganizador) {

        obtenerEventoDelOrganizador(idEvento, emailOrganizador);

        String filtro = normalizar(texto);

        return construirListado(idEvento).stream()
                .filter(r -> normalizar(r.nombres() + " " + r.apellidos() + " " + r.codigoReservacion())
                        .toLowerCase()
                        .contains(filtro))
                .toList();
    }

    // Métodos privados

    private Evento obtenerEventoDelOrganizador(Integer idEvento, String emailOrganizador) {

        Evento evento = eventoRepository.findById(idEvento)
                .orElseThrow(EventoNoEncontradoException::new);

        if (!evento.getOrganizador().getEmail().equalsIgnoreCase(emailOrganizador)) {
            throw new AccesoEventoDenegadoException();
        }
        return evento;
    }

    private AsistenciaResponseDTO registrar(Evento evento, Reservacion reservacion) {

        if (!reservacion.getEvento().getIdEvento().equals(evento.getIdEvento())) {
            throw new ReservacionDeOtroEventoException();
        }
        if (evento.getEstado() == EstadoEvento.Cancelado || evento.getEstado() == EstadoEvento.Finalizado) {
            throw new EventoSinRegistroAsistenciaException();
        }
        if (reservacion.getEstado() == EstadoReservacion.Cancelada) {
            throw new ReservacionCanceladaException();
        }
        if (reservacion.getEstado() != EstadoReservacion.Confirmada) {
            throw new ReservacionNoConfirmadaException();
        }

        Asistencia asistencia = asistenciaRepository
                .findByReservacion_IdReservacion(reservacion.getIdReservacion())
                .orElseGet(() -> {
                    Asistencia nueva = new Asistencia();
                    nueva.setReservacion(reservacion);
                    return nueva;
                });

        if (Boolean.TRUE.equals(asistencia.getEstadoAsistencia())) {
            throw new AsistenciaYaRegistradaException();
        }

        asistencia.setEstadoAsistencia(true);
        asistencia.setFechaRegistro(LocalDateTime.now());
        asistenciaRepository.save(asistencia);

        return aResponse(reservacion, asistencia);
    }

    private List<AsistenciaResponseDTO> construirListado(Integer idEvento) {

        Map<Integer, Asistencia> asistencias = asistenciaRepository
                .findByReservacion_Evento_IdEvento(idEvento).stream()
                .collect(Collectors.toMap(a -> a.getReservacion().getIdReservacion(), Function.identity()));

        return reservacionRepository
                .findByEvento_IdEventoAndEstado(idEvento, EstadoReservacion.Confirmada).stream()
                .map(r -> aResponse(r, asistencias.get(r.getIdReservacion())))
                .toList();
    }

    private AsistenciaResponseDTO aResponse(Reservacion reservacion, Asistencia asistencia) {

        boolean asistio = asistencia != null && Boolean.TRUE.equals(asistencia.getEstadoAsistencia());

        return new AsistenciaResponseDTO(
                reservacion.getIdReservacion(),
                reservacion.getCodigoReservacion(),
                reservacion.getParticipante().getNombres(),
                reservacion.getParticipante().getApellidos(),
                asistio,
                asistio ? asistencia.getFechaRegistro() : null
        );
    }

    // Quita tildes y diéresis, pasa a minúsculas y recorta espacios
    private String normalizar(String texto) {
        return Normalizer.normalize(texto, Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "")
                .toLowerCase()
                .trim();
    }
}
