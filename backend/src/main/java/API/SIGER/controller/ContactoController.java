package API.SIGER.controller;

import API.SIGER.DTO.ContactoRequestDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/contacto")
@RequiredArgsConstructor
public class ContactoController {

    private final JavaMailSender mailSender;

    @PostMapping
    public ResponseEntity<String> enviarSolicitud(@Valid @RequestBody ContactoRequestDTO request) {
        try {
            SimpleMailMessage correo = new SimpleMailMessage();

            correo.setFrom("no-reply@siger.edu.sv"); 

            correo.setTo("admin.siger@ues.edu.sv"); 
            correo.setSubject("Nueva Solicitud de Cuenta - SIGER");
            correo.setText("Se ha recibido una nueva solicitud:\n\n"
                    + "Nombre: " + request.nombre() + "\n"
                    + "Correo: " + request.email() + "\n"
                    + "Rol solicitado: " + request.rol() + "\n"
                    + "Motivo:\n" + request.motivo());

            mailSender.send(correo);
            return ResponseEntity.ok("{\"mensaje\": \"Solicitud enviada correctamente\"}");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("{\"mensaje\": \"Error al enviar el correo\"}");
        }
    }
}