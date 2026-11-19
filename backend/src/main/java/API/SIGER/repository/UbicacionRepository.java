package API.SIGER.repository;

import API.SIGER.persistence.entity.Ubicacion;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UbicacionRepository extends JpaRepository<Ubicacion, Integer> {

    boolean existsByLugarIgnoreCaseAndSedeIgnoreCase(String lugar, String sede);

    boolean existsByLugarIgnoreCaseAndSedeIgnoreCaseAndIdUbicacionNot(
            String lugar, String sede, Integer idUbicacion);
}
