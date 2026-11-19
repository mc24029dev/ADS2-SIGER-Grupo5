package API.SIGER.repository;

import API.SIGER.persistence.entity.Notificacion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificacionRepository extends JpaRepository<Notificacion, Integer> {

    List<Notificacion> findByUsuario_EmailOrderByFechaEnvioDesc(String email);
}

