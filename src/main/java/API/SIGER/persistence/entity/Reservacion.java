// reservacion
package API.SIGER.persistence.entity;

import API.SIGER.persistence.enums.EstadoReservacion;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "reservaciones")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Reservacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_reservacion")
    private Integer idReservacion;

    @Column(name = "fecha_reservacion", nullable = false)
    private LocalDate fechaReservacion;

    @Column(name = "codigo_reservacion", nullable = false, unique = true, length = 50)
    private String codigoReservacion;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado", nullable = false, length = 30)
    private EstadoReservacion estado;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_evento", nullable = false)
    private Evento evento;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_participante", nullable = false)
    private Participante participante;

}
