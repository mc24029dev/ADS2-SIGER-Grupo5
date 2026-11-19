package API.SIGER.persistence.entity;

import API.SIGER.persistence.enums.Rol;
import jakarta.persistence.Entity;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;

/**
 * Rol de usuario. Solo tiene id_usuario (PK y FK hacia usuarios);
 * todos los datos viven en Usuario.
 */
@Entity
@Table(name = "participantes")
@PrimaryKeyJoinColumn(name = "id_usuario")
public class Participante extends Usuario {

    public Participante() {
        super(Rol.PARTICIPANTE);
    }
}
