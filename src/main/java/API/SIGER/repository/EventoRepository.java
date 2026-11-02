package API.SIGER.repository;

import API.SIGER.persistence.entity.Evento;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface EventoRepository extends JpaRepository<Evento, Integer> {

    // Bloquea la fila del evento hasta que termine la transacción, para que
    // dos participantes no puedan tomar el último cupo al mismo tiempo.
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select e from Evento e where e.idEvento = :id")
    Optional<Evento> buscarConBloqueo(@Param("id") Integer id);
}