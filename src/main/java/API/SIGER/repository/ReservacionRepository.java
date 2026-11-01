package API.SIGER.repository;

import API.SIGER.persistence.entity.Reservacion;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReservacionRepository extends JpaRepository<Reservacion, Integer> {
}
