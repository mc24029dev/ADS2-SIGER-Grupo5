package API.SIGER.repository;

import API.SIGER.persistence.entity.Ubicacion;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UbicacionRepository extends JpaRepository<Ubicacion, Integer> {

    boolean existsByLugarAndSede(String lugar, String sede);

    boolean existsByLugarAndSedeAndIdUbicacionNot(
            String lugar,
            String sede,
            Integer idUbicacion
    );
}