package API.SIGER.persistence.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "reportes")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Reporte {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_reporte")
    private Integer idReporte;

    @Column(name = "tipo_reporte", nullable = false, length = 100)
    private String tipoReporte;

    @Column(name = "fecha_generacion", nullable = false)
    private LocalDate fechaGeneracion;

    // Administrador u Organizador que solicitó el reporte.
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_usuario_generador", nullable = false)
    private Usuario usuarioGenerador;

    @PrePersist
    private void inicializarFecha() {
        if (fechaGeneracion == null) {
            fechaGeneracion = LocalDate.now();
        }
    }
}
