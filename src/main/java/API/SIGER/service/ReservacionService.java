package API.SIGER.service;

import API.SIGER.DTO.ReservacionRequest;
import API.SIGER.DTO.ReservacionResponse;

public interface ReservacionService {

    /**
     * Reserva un cupo en un evento y genera el código único de la reservación.
     */
    ReservacionResponse reservar(ReservacionRequest request);

    /**
     * Cancela una reservación y libera el cupo del evento.
     */
    ReservacionResponse cancelar(Integer idReservacion);
}