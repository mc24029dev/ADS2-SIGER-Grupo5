package API.SIGER.persistence.entity;

import API.SIGER.persistence.enums.Rol;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Entidad padre de los tres roles. Usa herencia JOINED: los datos comunes
 * viven en "usuarios" y cada rol tiene su tabla (administradores,
 * organizadores, participantes) con id_usuario como PK y FK a usuarios.
 *
 * Es abstracta porque un usuario siempre debe ser de un rol concreto.
 */
@Entity
@Table(name = "usuarios")
@Inheritance(strategy = InheritanceType.JOINED)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@Setter
public abstract class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usuario")
    private Integer idUsuario;

    @Column(name = "nombres", nullable = false, length = 100)
    private String nombres;

    @Column(name = "apellidos", nullable = false, length = 100)
    private String apellidos;

    @Column(name = "email", nullable = false, unique = true, length = 150)
    private String email;

    // La columna en la BD se llama "contraseña" (con ñ). Se guarda el hash, nunca el texto plano.
    @Column(name = "contraseña", nullable = false, length = 255)
    private String contrasena;

    @Column(name = "estado", nullable = false)
    private Boolean estado;

    // Lo fija cada subclase y no se puede cambiar (el trigger de la BD también lo impide).
    @Enumerated(EnumType.STRING)
    @Column(name = "rol", nullable = false, length = 20, updatable = false)
    @Setter(AccessLevel.NONE)
    private Rol rol;

    protected Usuario(Rol rol) {
        this.rol = rol;
    }

    @PrePersist
    private void inicializarEstado() {
        if (estado == null) {
            estado = true;
        }
    }
}
