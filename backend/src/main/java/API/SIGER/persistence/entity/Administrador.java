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
@Table(name = "administradores")
@PrimaryKeyJoinColumn(name = "id_usuario")
public class Administrador extends Usuario {

    public Administrador() {
        super(Rol.ADMINISTRADOR);
    }
}
