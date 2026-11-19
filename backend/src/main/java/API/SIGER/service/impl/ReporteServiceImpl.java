package API.SIGER.service.impl;

import API.SIGER.DTO.Reporte.FiltroReporte;
import API.SIGER.DTO.Reporte.ReporteDocumento;
import API.SIGER.DTO.Reporte.ReporteDocumento.Columna;
import API.SIGER.DTO.Reporte.ReporteDocumento.Indicador;
import API.SIGER.exception.AccesoDenegadoException;
import API.SIGER.exception.EventoNoEncontradoException;
import API.SIGER.persistence.entity.*;
import API.SIGER.persistence.enums.EstadoEvento;
import API.SIGER.persistence.enums.EstadoReservacion;
import API.SIGER.persistence.enums.Rol;
import API.SIGER.persistence.enums.TipoReporte;
import API.SIGER.repository.*;
import API.SIGER.service.ReporteService;
import API.SIGER.service.pdf.ReportePDFGenerator;
import jakarta.persistence.criteria.Predicate;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class ReporteServiceImpl implements ReporteService {

    private static final DateTimeFormatter FECHA = DateTimeFormatter.ofPattern("dd/MM/yyyy");
    private static final DateTimeFormatter FECHA_HORA = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

    private final ReporteRepository reporteRepository;
    private final UsuarioRepository usuarioRepository;
    private final EventoRepository eventoRepository;
    private final ReservacionRepository reservacionRepository;
    private final AsistenciaRepository asistenciaRepository;
    private final ReportePDFGenerator pdfGenerator;

    // -- ASISTENCIA --

    @Override
    @Transactional
    public byte[] reporteAsistencia(Integer idEvento, String emailSolicitante) {
        Usuario solicitante = obtenerSolicitante(emailSolicitante);
        Evento evento = obtenerEventoPermitido(idEvento, solicitante);

        List<Reservacion> confirmadas = reservacionRepository
                .findByEvento_IdEventoAndEstado(idEvento, EstadoReservacion.Confirmada);

        // Solo cuentan como asistencia los registros en TRUE (FALSE = aún no registrada).
        Map<Integer, Asistencia> asistieron = asistenciaRepository
                .findByReservacion_Evento_IdEvento(idEvento).stream()
                .filter(Asistencia::getEstadoAsistencia)
                .collect(Collectors.toMap(a -> a.getReservacion().getIdReservacion(), Function.identity()));

        boolean finalizado = evento.getEstado() == EstadoEvento.Finalizado;
        List<List<String>> filas = new ArrayList<>();
        for (Reservacion r : confirmadas) {
            Asistencia a = asistieron.get(r.getIdReservacion());
            String estado = a != null ? "Asistió" : (finalizado ? "No asistió" : "Pendiente de registro");
            filas.add(List.of(
                    r.getCodigoReservacion(),
                    nombreCompleto(r.getParticipante()),
                    r.getParticipante().getEmail(),
                    estado,
                    a != null ? a.getFechaRegistro().format(FECHA_HORA) : "-"));
        }

        int total = confirmadas.size();
        int asistieronTotal = asistieron.size();
        List<Indicador> resumen = new ArrayList<>();
        resumen.add(new Indicador("Reservaciones confirmadas", String.valueOf(total)));
        resumen.add(new Indicador("Asistieron", String.valueOf(asistieronTotal)));
        resumen.add(new Indicador(finalizado ? "No asistieron" : "Pendientes de registro",
                String.valueOf(total - asistieronTotal)));
        if (finalizado && total > 0) {
            resumen.add(new Indicador("Porcentaje de asistencia",
                    String.format("%.1f %%", asistieronTotal * 100.0 / total)));
        }

        ReporteDocumento doc = new ReporteDocumento(
                "Reporte de Asistencia",
                nombreCompleto(solicitante),
                LocalDateTime.now(),
                List.of("Evento: " + evento.getNombre(), "Fecha del evento: " + evento.getFecha().format(FECHA_HORA)),
                resumen,
                List.of(new Columna("Código", 2f), new Columna("Participante", 3f), new Columna("Correo", 3f),
                        new Columna("Estado", 2f), new Columna("Registro", 2f)),
                filas,
                finalizado ? null : "Pendiente de registro: aún no se ha registrado el ingreso del participante.");

        return generarYRegistrar(TipoReporte.ASISTENCIA, doc, solicitante);
    }

    // -- EVENTOS --

    @Override
    @Transactional
    public byte[] reporteEventos(FiltroReporte filtro, String emailSolicitante) {
        Usuario solicitante = obtenerSolicitante(emailSolicitante);
        Integer idOrganizador = organizadorVisible(solicitante);

        Specification<Evento> spec = (root, query, cb) -> {
            List<Predicate> p = new ArrayList<>();
            if (idOrganizador != null) p.add(cb.equal(root.get("organizador").get("idUsuario"), idOrganizador));
            if (filtro.estadoEvento() != null) p.add(cb.equal(root.get("estado"), filtro.estadoEvento()));
            if (filtro.desde() != null) p.add(cb.greaterThanOrEqualTo(root.<LocalDateTime>get("fecha"), filtro.desde().atStartOfDay()));
            if (filtro.hasta() != null) p.add(cb.lessThanOrEqualTo(root.<LocalDateTime>get("fecha"), filtro.hasta().atTime(LocalTime.MAX)));
            return cb.and(p.toArray(Predicate[]::new));
        };
        List<Evento> eventos = eventoRepository.findAll(spec, Sort.by("fecha"));

        List<List<String>> filas = new ArrayList<>();
        for (Evento e : eventos) {
            filas.add(List.of(
                    e.getNombre(),
                    e.getFecha().format(FECHA_HORA),
                    e.getUbicacion().getLugar() + " - " + e.getUbicacion().getSede(),
                    nombreCompleto(e.getOrganizador()),
                    String.valueOf(e.getCapacidadMaxima()),
                    String.valueOf(e.getCapacidadMaxima() - e.getCupoDisponible()),
                    e.getEstado().name()));
        }

        Map<EstadoEvento, Long> porEstado = eventos.stream()
                .collect(Collectors.groupingBy(Evento::getEstado, Collectors.counting()));
        List<Indicador> resumen = new ArrayList<>();
        resumen.add(new Indicador("Total de eventos", String.valueOf(eventos.size())));
        for (EstadoEvento estado : EstadoEvento.values()) {
            resumen.add(new Indicador(estado.name(), String.valueOf(porEstado.getOrDefault(estado, 0L))));
        }

        List<String> filtros = new ArrayList<>();
        if (filtro.estadoEvento() != null) filtros.add("Estado: " + filtro.estadoEvento());
        agregarRangoFechas(filtros, filtro);

        ReporteDocumento doc = new ReporteDocumento(
                "Reporte de Eventos",
                nombreCompleto(solicitante),
                LocalDateTime.now(),
                filtros,
                resumen,
                List.of(new Columna("Evento", 4f), new Columna("Fecha", 2.5f), new Columna("Lugar", 4f),
                        new Columna("Organizador", 3f), new Columna("Capacidad", 1.5f),
                        new Columna("Reservas", 1.5f), new Columna("Estado", 2f)),
                filas,
                "Reservas = capacidad máxima menos cupo disponible (incluye reservaciones pendientes y confirmadas).");

        return generarYRegistrar(TipoReporte.EVENTOS, doc, solicitante);
    }

    // -- USUARIOS --

    @Override
    @Transactional
    public byte[] reporteUsuarios(String emailSolicitante) {
        Usuario solicitante = obtenerSolicitante(emailSolicitante);
        List<Usuario> usuarios = usuarioRepository.findAll(Sort.by("apellidos", "nombres"));

        List<List<String>> filas = new ArrayList<>();
        for (Usuario u : usuarios) {
            filas.add(List.of(nombreCompleto(u), u.getEmail(), u.getRol().name(),
                    u.getEstado() ? "Activo" : "Inactivo"));
        }

        Map<Rol, Long> porRol = usuarios.stream()
                .collect(Collectors.groupingBy(Usuario::getRol, Collectors.counting()));
        List<Indicador> resumen = new ArrayList<>();
        resumen.add(new Indicador("Total de usuarios", String.valueOf(usuarios.size())));
        for (Rol rol : Rol.values()) {
            resumen.add(new Indicador(rol.name(), String.valueOf(porRol.getOrDefault(rol, 0L))));
        }
        resumen.add(new Indicador("Cuentas inactivas",
                String.valueOf(usuarios.stream().filter(u -> !u.getEstado()).count())));

        ReporteDocumento doc = new ReporteDocumento(
                "Reporte de Usuarios",
                nombreCompleto(solicitante),
                LocalDateTime.now(),
                List.of(),
                resumen,
                List.of(new Columna("Nombre", 4f), new Columna("Correo", 4f),
                        new Columna("Rol", 2.5f), new Columna("Estado", 2f)),
                filas,
                null);

        return generarYRegistrar(TipoReporte.USUARIOS, doc, solicitante);
    }

    // --RESERVACIONES

    @Override
    @Transactional
    public byte[] reporteReservaciones(FiltroReporte filtro, String emailSolicitante) {
        Usuario solicitante = obtenerSolicitante(emailSolicitante);
        Integer idOrganizador = organizadorVisible(solicitante);

        Evento eventoFiltrado = null;
        if (filtro.idEvento() != null) {
            eventoFiltrado = obtenerEventoPermitido(filtro.idEvento(), solicitante);
        }

        Specification<Reservacion> spec = (root, query, cb) -> {
            List<Predicate> p = new ArrayList<>();
            if (idOrganizador != null) p.add(cb.equal(root.get("evento").get("organizador").get("idUsuario"), idOrganizador));
            if (filtro.idEvento() != null) p.add(cb.equal(root.get("evento").get("idEvento"), filtro.idEvento()));
            if (filtro.desde() != null) p.add(cb.greaterThanOrEqualTo(root.<LocalDate>get("fechaReservacion"), filtro.desde()));
            if (filtro.hasta() != null) p.add(cb.lessThanOrEqualTo(root.<LocalDate>get("fechaReservacion"), filtro.hasta()));
            return cb.and(p.toArray(Predicate[]::new));
        };
        List<Reservacion> reservaciones = reservacionRepository.findAll(spec, Sort.by("fechaReservacion"));

        List<List<String>> filas = new ArrayList<>();
        for (Reservacion r : reservaciones) {
            filas.add(List.of(
                    r.getCodigoReservacion(),
                    nombreCompleto(r.getParticipante()),
                    r.getEvento().getNombre(),
                    r.getFechaReservacion().format(FECHA),
                    r.getEstado().name()));
        }

        Map<EstadoReservacion, Long> porEstado = reservaciones.stream()
                .collect(Collectors.groupingBy(Reservacion::getEstado, Collectors.counting()));
        List<Indicador> resumen = new ArrayList<>();
        resumen.add(new Indicador("Total de reservaciones", String.valueOf(reservaciones.size())));
        for (EstadoReservacion estado : EstadoReservacion.values()) {
            resumen.add(new Indicador(estado.name(), String.valueOf(porEstado.getOrDefault(estado, 0L))));
        }

        List<String> filtros = new ArrayList<>();
        if (eventoFiltrado != null) filtros.add("Evento: " + eventoFiltrado.getNombre());
        agregarRangoFechas(filtros, filtro);

        ReporteDocumento doc = new ReporteDocumento(
                "Reporte de Reservaciones",
                nombreCompleto(solicitante),
                LocalDateTime.now(),
                filtros,
                resumen,
                List.of(new Columna("Código", 2f), new Columna("Participante", 3f),
                        new Columna("Evento", 4f), new Columna("Fecha", 2f), new Columna("Estado", 2f)),
                filas,
                null);

        return generarYRegistrar(TipoReporte.RESERVACIONES, doc, solicitante);
    }

    // -- AUXILIARES --

    private Usuario obtenerSolicitante(String email) {
        return usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException(email));
    }

    // null = ve todo (Administrador); si no, solo los eventos de ese Organizador.
    private Integer organizadorVisible(Usuario solicitante) {
        return solicitante.getRol() == Rol.ADMINISTRADOR ? null : solicitante.getIdUsuario();
    }

    private Evento obtenerEventoPermitido(Integer idEvento, Usuario solicitante) {
        Evento evento = eventoRepository.findById(idEvento)
                .orElseThrow(EventoNoEncontradoException::new);
        Integer idOrganizador = organizadorVisible(solicitante);
        if (idOrganizador != null && !evento.getOrganizador().getIdUsuario().equals(idOrganizador)) {
            throw new AccesoDenegadoException("No puedes generar reportes de un evento que no organizas");
        }
        return evento;
    }

    private void agregarRangoFechas(List<String> filtros, FiltroReporte filtro) {
        if (filtro.desde() != null) filtros.add("Desde: " + filtro.desde().format(FECHA));
        if (filtro.hasta() != null) filtros.add("Hasta: " + filtro.hasta().format(FECHA));
    }

    private String nombreCompleto(Usuario u) {
        return u.getNombres() + " " + u.getApellidos();
    }

    // Se registra en "reportes" solo si el PDF se generó sin errores.
    private byte[] generarYRegistrar(TipoReporte tipo, ReporteDocumento doc, Usuario solicitante) {
        byte[] pdf = pdfGenerator.generar(doc);

        Reporte registro = new Reporte();
        registro.setTipoReporte(tipo.getEtiqueta());
        registro.setUsuarioGenerador(solicitante);
        reporteRepository.save(registro);

        return pdf;
    }
}