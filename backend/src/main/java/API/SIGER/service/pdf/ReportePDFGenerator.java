package API.SIGER.service.pdf;

import API.SIGER.DTO.Reporte.ReporteDocumento;
import org.openpdf.text.Document;
import org.openpdf.text.DocumentException;
import org.openpdf.text.Element;
import org.openpdf.text.Font;
import org.openpdf.text.PageSize;
import org.openpdf.text.Paragraph;
import org.openpdf.text.Phrase;
import org.openpdf.text.pdf.BaseFont;
import org.openpdf.text.pdf.PdfContentByte;
import org.openpdf.text.pdf.PdfPCell;
import org.openpdf.text.pdf.PdfPTable;
import org.openpdf.text.pdf.PdfPageEventHelper;
import org.openpdf.text.pdf.PdfTemplate;
import org.openpdf.text.pdf.PdfWriter;
import org.springframework.stereotype.Component;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Component
public class ReportePDFGenerator {

    private static final DateTimeFormatter FORMATO_FECHA = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

    private static final Color COLOR_ENCABEZADO = new Color(33, 64, 120);
    private static final Color COLOR_FILA_ALTERNA = new Color(240, 244, 250);
    private static final Color COLOR_BORDE = new Color(200, 205, 215);

    private static final Font FUENTE_TITULO = new Font(Font.HELVETICA, 18, Font.BOLD, COLOR_ENCABEZADO);
    private static final Font FUENTE_META = new Font(Font.HELVETICA, 9, Font.NORMAL, Color.DARK_GRAY);
    private static final Font FUENTE_SECCION = new Font(Font.HELVETICA, 11, Font.BOLD);
    private static final Font FUENTE_ENCABEZADO_TABLA = new Font(Font.HELVETICA, 9, Font.BOLD, Color.WHITE);
    private static final Font FUENTE_CELDA = new Font(Font.HELVETICA, 9, Font.NORMAL);
    private static final Font FUENTE_NOTA = new Font(Font.HELVETICA, 8, Font.ITALIC, Color.DARK_GRAY);

    public byte[] generar(ReporteDocumento reporte) {
        ByteArrayOutputStream salida = new ByteArrayOutputStream();
        Document pdf = new Document(PageSize.A4, 36, 36, 36, 54);

        try {
            PdfWriter writer = PdfWriter.getInstance(pdf, salida);
            writer.setPageEvent(new PieDePagina());
            pdf.addTitle(reporte.titulo());
            pdf.open();

            agregarEncabezado(pdf, reporte);
            agregarResumen(pdf, reporte);
            agregarTabla(pdf, reporte);
            agregarNota(pdf, reporte);

            pdf.close(); // debe cerrarse antes de leer los bytes
        } catch (DocumentException e) {
            throw new IllegalStateException("No se pudo generar el PDF del reporte", e);
        }
        return salida.toByteArray();
    }

    private void agregarEncabezado(Document pdf, ReporteDocumento reporte) throws DocumentException {
        pdf.add(new Paragraph(texto(reporte.titulo()), FUENTE_TITULO));

        Paragraph meta = new Paragraph();
        meta.setSpacingBefore(4);
        meta.setSpacingAfter(10);
        meta.add(new Phrase("Generado por: " + texto(reporte.generadoPor()) + "\n", FUENTE_META));
        meta.add(new Phrase("Fecha de generación: "
                + (reporte.fechaGeneracion() == null ? "-" : reporte.fechaGeneracion().format(FORMATO_FECHA))
                + "\n", FUENTE_META));
        if (reporte.filtros() != null && !reporte.filtros().isEmpty()) {
            meta.add(new Phrase("Filtros: " + String.join(" | ", reporte.filtros()), FUENTE_META));
        }
        pdf.add(meta);
    }

    private void agregarResumen(Document pdf, ReporteDocumento reporte) throws DocumentException {
        List<ReporteDocumento.Indicador> resumen = reporte.resumen();
        if (resumen == null || resumen.isEmpty()) {
            return;
        }

        Paragraph titulo = new Paragraph("Resumen", FUENTE_SECCION);
        titulo.setSpacingAfter(4);
        pdf.add(titulo);

        PdfPTable tabla = new PdfPTable(2);
        tabla.setWidthPercentage(60);
        tabla.setHorizontalAlignment(Element.ALIGN_LEFT);
        tabla.setWidths(new float[]{3f, 1.5f});
        tabla.setSpacingAfter(12);

        for (ReporteDocumento.Indicador indicador : resumen) {
            tabla.addCell(celda(indicador.etiqueta(), FUENTE_CELDA, null));
            tabla.addCell(celda(indicador.valor(), new Font(Font.HELVETICA, 9, Font.BOLD), null));
        }
        pdf.add(tabla);
    }

    private void agregarTabla(Document pdf, ReporteDocumento reporte) throws DocumentException {
        if (reporte.filas() == null || reporte.filas().isEmpty()) {
            Paragraph vacio = new Paragraph("Sin registros para los filtros aplicados", FUENTE_CELDA);
            vacio.setSpacingBefore(8);
            pdf.add(vacio);
            return;
        }

        List<ReporteDocumento.Columna> columnas = reporte.columnas();
        float[] anchos = new float[columnas.size()];
        for (int i = 0; i < anchos.length; i++) {
            anchos[i] = columnas.get(i).peso();
        }

        PdfPTable tabla = new PdfPTable(columnas.size());
        tabla.setWidthPercentage(100);
        tabla.setWidths(anchos);
        tabla.setHeaderRows(1);        // repite el encabezado en cada página
        tabla.setSpacingBefore(4);

        for (ReporteDocumento.Columna columna : columnas) {
            PdfPCell celda = celda(columna.titulo(), FUENTE_ENCABEZADO_TABLA, COLOR_ENCABEZADO);
            celda.setHorizontalAlignment(Element.ALIGN_CENTER);
            tabla.addCell(celda);
        }

        int indice = 0;
        for (List<String> fila : reporte.filas()) {
            Color fondo = (indice % 2 == 1) ? COLOR_FILA_ALTERNA : null;
            for (int i = 0; i < columnas.size(); i++) {
                String valor = i < fila.size() ? fila.get(i) : null;
                tabla.addCell(celda(valor, FUENTE_CELDA, fondo));
            }
            indice++;
        }
        pdf.add(tabla);
    }

    private void agregarNota(Document pdf, ReporteDocumento reporte) throws DocumentException {
        if (reporte.nota() == null || reporte.nota().isBlank()) {
            return;
        }
        Paragraph nota = new Paragraph(reporte.nota(), FUENTE_NOTA);
        nota.setSpacingBefore(10);
        pdf.add(nota);
    }

    private PdfPCell celda(String valor, Font fuente, Color fondo) {
        PdfPCell celda = new PdfPCell(new Phrase(texto(valor), fuente));
        celda.setPadding(5);
        celda.setBorderColor(COLOR_BORDE);
        celda.setBorderWidth(0.5f);
        if (fondo != null) {
            celda.setBackgroundColor(fondo);
        }
        return celda;
    }

    private String texto(String valor) {
        return (valor == null || valor.isBlank()) ? "-" : valor;
    }

    // Dibuja "Página X de Y" y "SIGER" en el pie de cada página.
    private static class PieDePagina extends PdfPageEventHelper {

        private final BaseFont fuente;
        private PdfTemplate totalPaginas;

        PieDePagina() {
            try {
                this.fuente = BaseFont.createFont(BaseFont.HELVETICA, BaseFont.WINANSI, BaseFont.NOT_EMBEDDED);
            } catch (DocumentException | IOException e) {
                throw new IllegalStateException("No se pudo cargar la fuente del pie de página", e);
            }
        }

        @Override
        public void onOpenDocument(PdfWriter writer, Document document) {
            // Espacio reservado donde luego se escribe el total de páginas.
            totalPaginas = writer.getDirectContent().createTemplate(30, 12);
        }

        @Override
        public void onEndPage(PdfWriter writer, Document document) {
            PdfContentByte cb = writer.getDirectContent();
            String texto = "Página " + writer.getPageNumber() + " de ";
            float ancho = fuente.getWidthPoint(texto, 8);
            float x = document.right() - ancho - 20;
            float y = document.bottom() - 20;

            cb.beginText();
            cb.setFontAndSize(fuente, 8);
            cb.setTextMatrix(x, y);
            cb.showText(texto);
            cb.endText();
            cb.addTemplate(totalPaginas, x + ancho, y);

            cb.beginText();
            cb.setFontAndSize(fuente, 8);
            cb.setTextMatrix(document.left(), y);
            cb.showText("SIGER - Sistema de Gestión de Eventos y Reservaciones");
            cb.endText();
        }

        @Override
        public void onCloseDocument(PdfWriter writer, Document document) {
            totalPaginas.beginText();
            totalPaginas.setFontAndSize(fuente, 8);
            totalPaginas.setTextMatrix(0, 0);
            totalPaginas.showText(String.valueOf(writer.getPageNumber() - 1));
            totalPaginas.endText();
        }
    }
}