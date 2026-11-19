package API.SIGER.service.pdf;

import API.SIGER.DTO.Comprobante.ComprobanteDocumento;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.WriterException;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import org.openpdf.text.Document;
import org.openpdf.text.DocumentException;
import org.openpdf.text.Element;
import org.openpdf.text.Font;
import org.openpdf.text.Image;
import org.openpdf.text.PageSize;
import org.openpdf.text.Paragraph;
import org.openpdf.text.Phrase;
import org.openpdf.text.pdf.PdfPCell;
import org.openpdf.text.pdf.PdfPTable;
import org.openpdf.text.pdf.PdfWriter;
import org.springframework.stereotype.Component;

import javax.imageio.ImageIO;
import java.awt.Color;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.format.DateTimeFormatter;
import java.util.Map;

@Component
public class ComprobantePDFGenerator {

    private static final DateTimeFormatter FECHA = DateTimeFormatter.ofPattern("dd/MM/yyyy");
    private static final DateTimeFormatter FECHA_HORA = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

    private static final Color COLOR_PRINCIPAL = new Color(33, 64, 120);
    private static final Color COLOR_BORDE = new Color(200, 205, 215);

    private static final Font FUENTE_TITULO = new Font(Font.HELVETICA, 20, Font.BOLD, COLOR_PRINCIPAL);
    private static final Font FUENTE_SUBTITULO = new Font(Font.HELVETICA, 10, Font.NORMAL, Color.DARK_GRAY);
    private static final Font FUENTE_ETIQUETA = new Font(Font.HELVETICA, 10, Font.BOLD);
    private static final Font FUENTE_VALOR = new Font(Font.HELVETICA, 10, Font.NORMAL);
    private static final Font FUENTE_CODIGO = new Font(Font.COURIER, 16, Font.BOLD);
    private static final Font FUENTE_NOTA = new Font(Font.HELVETICA, 9, Font.ITALIC, Color.DARK_GRAY);

    public byte[] generar(ComprobanteDocumento c) {
        ByteArrayOutputStream salida = new ByteArrayOutputStream();
        Document pdf = new Document(PageSize.A4, 48, 48, 48, 48);

        try {
            PdfWriter.getInstance(pdf, salida);
            pdf.addTitle("Comprobante de reservación " + c.codigo());
            pdf.open();

            Paragraph titulo = new Paragraph("Comprobante de reservación", FUENTE_TITULO);
            titulo.setAlignment(Element.ALIGN_CENTER);
            pdf.add(titulo);

            Paragraph subtitulo = new Paragraph("SIGER - Sistema de Gestión de Eventos y Reservaciones", FUENTE_SUBTITULO);
            subtitulo.setAlignment(Element.ALIGN_CENTER);
            subtitulo.setSpacingAfter(20);
            pdf.add(subtitulo);

            PdfPTable datos = new PdfPTable(2);
            datos.setWidthPercentage(100);
            datos.setWidths(new float[]{1.5f, 3.5f});
            fila(datos, "Evento", c.evento());
            fila(datos, "Fecha del evento", c.fechaEvento() == null ? null : c.fechaEvento().format(FECHA_HORA));
            fila(datos, "Lugar", c.lugar());
            fila(datos, "Participante", c.participante());
            fila(datos, "Correo", c.correo());
            fila(datos, "Fecha de reservación", c.fechaReservacion() == null ? null : c.fechaReservacion().format(FECHA));
            fila(datos, "Estado", c.estado());
            datos.setSpacingAfter(24);
            pdf.add(datos);

            Image qr = Image.getInstance(generarQr(c.codigo()));
            qr.scaleAbsolute(160, 160);
            qr.setAlignment(Element.ALIGN_CENTER);
            pdf.add(qr);

            Paragraph codigo = new Paragraph(c.codigo(), FUENTE_CODIGO);
            codigo.setAlignment(Element.ALIGN_CENTER);
            codigo.setSpacingBefore(8);
            pdf.add(codigo);

            Paragraph nota = new Paragraph(
                    "Presenta este comprobante (QR o código) al ingresar al evento.", FUENTE_NOTA);
            nota.setAlignment(Element.ALIGN_CENTER);
            nota.setSpacingBefore(12);
            pdf.add(nota);

            pdf.close(); // debe cerrarse antes de leer los bytes
        } catch (DocumentException | IOException | WriterException e) {
            throw new IllegalStateException("No se pudo generar el comprobante", e);
        }
        return salida.toByteArray();
    }

    private void fila(PdfPTable tabla, String etiqueta, String valor) {
        tabla.addCell(celda(etiqueta, FUENTE_ETIQUETA));
        tabla.addCell(celda(valor, FUENTE_VALOR));
    }

    private PdfPCell celda(String texto, Font fuente) {
        PdfPCell celda = new PdfPCell(new Phrase(texto == null || texto.isBlank() ? "-" : texto, fuente));
        celda.setPadding(6);
        celda.setBorderColor(COLOR_BORDE);
        celda.setBorderWidth(0.5f);
        return celda;
    }

    private byte[] generarQr(String contenido) throws WriterException, IOException {
        BitMatrix matriz = new QRCodeWriter().encode(
                contenido, BarcodeFormat.QR_CODE, 300, 300, Map.of(EncodeHintType.MARGIN, 1));

        BufferedImage imagen = new BufferedImage(matriz.getWidth(), matriz.getHeight(), BufferedImage.TYPE_INT_RGB);
        for (int x = 0; x < matriz.getWidth(); x++) {
            for (int y = 0; y < matriz.getHeight(); y++) {
                imagen.setRGB(x, y, matriz.get(x, y) ? 0x000000 : 0xFFFFFF);
            }
        }
        ByteArrayOutputStream png = new ByteArrayOutputStream();
        ImageIO.write(imagen, "PNG", png);
        return png.toByteArray();
    }
}