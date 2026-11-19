package API.SIGER.DTO.Reporte;

import API.SIGER.persistence.enums.EstadoEvento;

import java.time.LocalDate;

public record FiltroReporte(
        Integer idEvento,
        EstadoEvento estadoEvento,
        LocalDate desde,
        LocalDate hasta
) {}