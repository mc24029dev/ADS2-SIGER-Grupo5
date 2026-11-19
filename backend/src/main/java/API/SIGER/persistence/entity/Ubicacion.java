package API.SIGER.persistence.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(
        name = "ubicaciones",
        uniqueConstraints = @UniqueConstraint(
                name = "uq_ubicaciones_lugar_sede",
                columnNames = {"lugar", "sede"}
        )
)
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Ubicacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_ubicacion")
    private Integer idUbicacion;

    @Column(name = "lugar", nullable = false, length = 100)
    private String lugar;

    @Column(name = "sede", nullable = false, length = 100)
    private String sede;
}
