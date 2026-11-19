package API.SIGER.repository;

import API.SIGER.persistence.entity.Organizador;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface OrganizadorRepository extends JpaRepository<Organizador, Integer> {

    Optional<Organizador> findByEmail(String email);
}

