package API.SIGER.service;

import API.SIGER.DTO.Reporte.FiltroReporte;

public interface ReporteService {

    byte[] reporteAsistencia(Integer idEvento, String emailSolicitante);

    byte[] reporteEventos(FiltroReporte filtro, String emailSolicitante);

    byte[] reporteUsuarios(String emailSolicitante);

    byte[] reporteReservaciones(FiltroReporte filtro, String emailSolicitante);
}