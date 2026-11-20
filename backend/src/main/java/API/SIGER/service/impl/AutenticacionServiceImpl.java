package API.SIGER.service.impl;

import API.SIGER.DTO.Auth.PasswordRequestDTO;
import API.SIGER.DTO.Auth.PerfilRequestDTO;
import API.SIGER.DTO.Auth.RegistroRequestDTO;
import API.SIGER.DTO.Auth.UsuarioResponseDTO;
import API.SIGER.exception.EmailYaRegistradoException;
import API.SIGER.exception.ReglaNegocioException;
import API.SIGER.exception.UserNotFoundException;
import API.SIGER.persistence.entity.Participante;
import API.SIGER.persistence.entity.Usuario;
import API.SIGER.repository.UsuarioRepository;
import API.SIGER.service.AutenticacionService;
import lombok.AllArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Locale;

@Service
@AllArgsConstructor
public class AutenticacionServiceImpl implements AutenticacionService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JavaMailSender mailSender;

    @Override
    @Transactional
    public UsuarioResponseDTO registrarParticipante(RegistroRequestDTO request) {

        String email = normalizarEmail(request.email());

        if (usuarioRepository.existsByEmail(email)) {
            throw new EmailYaRegistradoException();
        }

        Participante participante = new Participante();
        participante.setNombres(request.nombres().trim());
        participante.setApellidos(request.apellidos().trim());
        participante.setEmail(email);
        participante.setContrasena(passwordEncoder.encode(request.contrasena()));

        try {
            usuarioRepository.save(participante);
        } catch (DataIntegrityViolationException e) {
            throw new EmailYaRegistradoException();
        }

        return UsuarioResponseDTO.desde(participante);
    }

    @Override
    @Transactional(readOnly = true)
    public UsuarioResponseDTO obtenerPerfil(String email) {
        String emailNormalizado = normalizarEmail(email);
        Usuario usuario = usuarioRepository.findByEmail(emailNormalizado)
                .orElseThrow(() -> new UserNotFoundException(emailNormalizado));
        return UsuarioResponseDTO.desde(usuario);
    }

    private String normalizarEmail(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }

     @Override
    @Transactional
    public UsuarioResponseDTO actualizarPerfil(String email, PerfilRequestDTO request) {
        Usuario usuario = usuarioRepository.findByEmail(normalizarEmail(email))
            .orElseThrow(() -> new UserNotFoundException(email));
    
            usuario.setNombres(request.nombres().trim());
            usuario.setApellidos(request.apellidos().trim());
            
            usuarioRepository.save(usuario);
            
            return UsuarioResponseDTO.desde(usuario);
    }

    @Override
    @Transactional
    public void cambiarPassword(String email, PasswordRequestDTO request) {
        Usuario usuario = usuarioRepository.findByEmail(normalizarEmail(email))
                .orElseThrow(() -> new UserNotFoundException(email));

        if (!passwordEncoder.matches(request.contrasenaActual(), usuario.getContrasena())) {
            throw new ReglaNegocioException("La contraseña actual es incorrecta"); 
        }

        usuario.setContrasena(passwordEncoder.encode(request.nuevaContrasena()));
        usuarioRepository.save(usuario);

        try {
            SimpleMailMessage correo = new SimpleMailMessage();
            correo.setFrom("no-reply@siger.edu.sv");
            correo.setTo(usuario.getEmail());
            correo.setSubject("SIGER - Contraseña Actualizada");
            correo.setText("Hola " + usuario.getNombres() + ",\n\nTe informamos que tu contraseña en SIGER ha sido cambiada exitosamente.\n\nSi no realizaste este cambio, por favor contacta al administrador inmediatamente.");
            mailSender.send(correo);
        } catch (Exception e) {
            System.err.println("No se pudo enviar el correo de cambio de contraseña: " + e.getMessage());
        }
    }
}