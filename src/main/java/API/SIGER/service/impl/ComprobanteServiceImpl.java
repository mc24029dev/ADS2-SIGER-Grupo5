package API.SIGER.service.impl;

import API.SIGER.DTO.Comprobante.ComprobanteDocumento;
import API.SIGER.exception.AccesoDenegadoException;
import API.SIGER.exception.RecursoNoEncontradoException;
import API.SIGER.exception.ReglaNegocioException;
import API.SIGER.persistence.entity.Evento;
import API.SIGER.persistence.entity.Participante;
import API.SIGER.persistence.entity.Reservacion;
import API.SIGER.persistence.enums.EstadoEvento;
import API.SIGER.persistence.enums.EstadoReservacion;
import API.SIGER.repository.ReservacionRepository;
import API.SIGER.service.ComprobanteService;
import API.SIGER.service.pdf.ComprobantePDFGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ComprobanteServiceImpl implements ComprobanteService {

    private final ReservacionRepository reservacionRepository;
    private final ComprobantePDFGenerator pdfGenerator;

    // readOnly: evento, ubicación y participante son LAZY y se leen dentro de la transacción.
    @Override
    @Transactional(readOnly = true)
    public byte[] generar(Integer idReservacion, String emailSolicitante) {

        Reservacion reservacion = reservacionRepository.findById(idReservacion)
                .orElseThrow(() -> new RecursoNoEncontradoException("La reservación no existe"));

        Participante participante = reservacion.getParticipante();

        if (!participante.getEmail().equals(emailSolicitante)) {
            throw new AccesoDenegadoException("No puedes descargar el comprobante de una reservación que no es tuya");
        }
        if (reservacion.getEstado() != EstadoReservacion.Confirmada) {
            throw new ReglaNegocioException("Solo las reservaciones confirmadas tienen comprobante");
        }

        Evento evento = reservacion.getEvento();

        if (evento.getEstado() == EstadoEvento.Cancelado) {
            throw new ReglaNegocioException("El evento fue cancelado, por lo que el comprobante ya no es válido");
        }

        return pdfGenerator.generar(new ComprobanteDocumento(
                reservacion.getCodigoReservacion(),
                evento.getNombre(),
                evento.getFecha(),
                evento.getUbicacion().getLugar() + " - " + evento.getUbicacion().getSede(),
                participante.getNombres() + " " + participante.getApellidos(),
                participante.getEmail(),
                reservacion.getFechaReservacion(),
                reservacion.getEstado().name()));
    }
}