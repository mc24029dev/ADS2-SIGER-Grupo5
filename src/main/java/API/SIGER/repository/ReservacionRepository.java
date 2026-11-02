package API.SIGER.repository;

import API.SIGER.persistence.entity.Reservacion;
import API.SIGER.persistence.enums.EstadoReservacion;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReservacionRepository extends JpaRepository<Reservacion, Integer> {

    // ¿El participante ya tiene una reservación de ese evento que no esté cancelada?
    boolean existsByEvento_IdEventoAndParticipante_IdUsuarioAndEstadoNot(
            Integer idEvento, Integer idParticipante, EstadoReservacion estado);
}
