package API.SIGER.service.impl;

import API.SIGER.DTO.Evento.EventoRequestDTO;
import API.SIGER.DTO.EventoResponse;
import API.SIGER.exception.EventoAjenoException;
import API.SIGER.exception.EventoNoEncontradoException;
import API.SIGER.exception.RecursoNoEncontradoException;
import API.SIGER.exception.ReglaNegocioException;
import API.SIGER.persistence.entity.Evento;
import API.SIGER.persistence.entity.Organizador;
import API.SIGER.persistence.entity.Ubicacion;
import API.SIGER.persistence.entity.Usuario;
import API.SIGER.persistence.enums.EstadoEvento;
import API.SIGER.persistence.enums.Rol;
import API.SIGER.repository.EventoRepository;
import API.SIGER.repository.OrganizadorRepository;
import API.SIGER.repository.UbicacionRepository;
import API.SIGER.service.EventoService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EventoServiceImpl implements EventoService {

    private final EventoRepository eventoRepository;
    private final UbicacionRepository ubicacionRepository;
    private final OrganizadorRepository organizadorRepository;
    private final API.SIGER.repository.UsuarioRepository usuarioRepository;

    @Override
    @Transactional(readOnly = true)
    public List<EventoResponse> listar() {
        return eventoRepository.findAll().stream()
                .map(EventoResponse::desde)
                .toList();
    }

    @Override
    @Transactional
    public EventoResponse crear(EventoRequestDTO request, String emailSolicitante) {
        Usuario usuario = usuarioRepository.findByEmail(emailSolicitante)
                .orElseThrow(() -> new RecursoNoEncontradoException("El usuario no existe"));

        Organizador organizador;

        if (usuario.getRol() == Rol.ADMINISTRADOR) {
            if (request.idOrganizador() == null) {
                throw new ReglaNegocioException("Como Administrador, debes asignar un Organizador al evento");
            }
            organizador = organizadorRepository.findById(request.idOrganizador())
                    .orElseThrow(() -> new RecursoNoEncontradoException("El organizador seleccionado no existe"));
        } else {
            organizador = organizadorRepository.findByEmail(emailSolicitante)
                    .orElseThrow(() -> new RecursoNoEncontradoException("El organizador no existe"));
        }

        if (!request.fecha().isAfter(LocalDateTime.now())) {
            throw new ReglaNegocioException("La fecha del evento debe ser posterior a la fecha actual");
        }

        Evento evento = new Evento();
        evento.setNombre(request.nombre().trim());
        evento.setFecha(request.fecha());
        evento.setDescripcion(limpiar(request.descripcion()));
        evento.setCapacidadMaxima(request.capacidadMaxima());
        evento.setCupoDisponible(request.capacidadMaxima());
        evento.setEstado(EstadoEvento.Activo);
        evento.setUbicacion(obtenerUbicacion(request.idUbicacion()));
        evento.setOrganizador(organizador);

        return EventoResponse.desde(eventoRepository.save(evento));
    }

    @Override
    @Transactional
    public EventoResponse actualizar(Integer idEvento, EventoRequestDTO request, String emailSolicitante) {
        Evento evento = obtenerEventoDelSolicitante(idEvento, emailSolicitante);

        if (evento.getEstado() == EstadoEvento.Cancelado || evento.getEstado() == EstadoEvento.Finalizado) {
            throw new ReglaNegocioException("No se puede modificar un evento cancelado o finalizado");
        }

        int ocupados = evento.getCapacidadMaxima() - evento.getCupoDisponible();
        if (request.capacidadMaxima() < ocupados) {
            throw new ReglaNegocioException("La capacidad máxima no puede ser menor a los " + ocupados + " cupos ya reservados");
        }

        boolean cambioFecha = !evento.getFecha().equals(request.fecha());
        if (cambioFecha && !request.fecha().isAfter(LocalDateTime.now())) {
            throw new ReglaNegocioException("La nueva fecha del evento debe ser posterior a la fecha actual");
        }

        Usuario usuario = usuarioRepository.findByEmail(emailSolicitante).orElseThrow();
        if (usuario.getRol() == Rol.ADMINISTRADOR && request.idOrganizador() != null) {
            Organizador nuevoOrganizador = organizadorRepository.findById(request.idOrganizador())
                    .orElseThrow(() -> new RecursoNoEncontradoException("El organizador seleccionado no existe"));
            evento.setOrganizador(nuevoOrganizador);
        }

        evento.setNombre(request.nombre().trim());
        evento.setDescripcion(limpiar(request.descripcion()));
        evento.setCapacidadMaxima(request.capacidadMaxima());
        evento.setCupoDisponible(request.capacidadMaxima() - ocupados);
        evento.setUbicacion(obtenerUbicacion(request.idUbicacion()));
        
        if (cambioFecha) {
            evento.setFecha(request.fecha());
            evento.setEstado(EstadoEvento.Reprogramado);
        }

        return EventoResponse.desde(evento);
    }

    @Override
    @Transactional
    public EventoResponse cambiarEstado(Integer idEvento, EstadoEvento nuevoEstado, String emailOrganizador) {
        Evento evento = obtenerEventoDelSolicitante(idEvento, emailOrganizador);

        if (evento.getEstado() == EstadoEvento.Cancelado || evento.getEstado() == EstadoEvento.Finalizado) {
            throw new ReglaNegocioException(
                    "El evento ya está " + evento.getEstado().name().toLowerCase() + " y no puede cambiar de estado");
        }
        if (nuevoEstado != EstadoEvento.Cancelado && nuevoEstado != EstadoEvento.Finalizado) {
            throw new ReglaNegocioException(
                    "Solo se puede cambiar el estado a Cancelado o Finalizado; para reprogramar modifica la fecha");
        }

        evento.setEstado(nuevoEstado);
        return EventoResponse.desde(evento);
    }

    // --- Métodos privados ---

    private Evento obtenerEventoDelSolicitante(Integer idEvento, String emailSolicitante) {
        Evento evento = eventoRepository.buscarConBloqueo(idEvento)
                .orElseThrow(EventoNoEncontradoException::new);

        Usuario usuario = usuarioRepository.findByEmail(emailSolicitante)
                .orElseThrow(() -> new RecursoNoEncontradoException("Usuario no encontrado"));

        if (usuario.getRol() != Rol.ADMINISTRADOR && !evento.getOrganizador().getEmail().equalsIgnoreCase(emailSolicitante)) {
            throw new EventoAjenoException();
        }
        return evento;
    }

    private Ubicacion obtenerUbicacion(Integer idUbicacion) {
        return ubicacionRepository.findById(idUbicacion)
                .orElseThrow(() -> new RecursoNoEncontradoException("La ubicación no existe"));
    }

    private String limpiar(String texto) {
        return (texto == null || texto.isBlank()) ? null : texto.trim();
    }
}
