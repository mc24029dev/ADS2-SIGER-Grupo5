package API.SIGER.repository;

import API.SIGER.persistence.entity.Asistencia;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AsistenciaRepository extends JpaRepository<Asistencia, Integer> {

    Optional<Asistencia> findByReservacion_IdReservacion(Integer idReservacion);

    List<Asistencia> findByReservacion_Evento_IdEvento(Integer idEvento);
}
