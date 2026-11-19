package API.SIGER.service.impl;

import API.SIGER.DTO.Auth.RegistroRequestDTO;
import API.SIGER.DTO.Auth.UsuarioResponseDTO;
import API.SIGER.exception.EmailYaRegistradoException;
import API.SIGER.exception.UserNotFoundException;
import API.SIGER.persistence.entity.Participante;
import API.SIGER.persistence.entity.Usuario;
import API.SIGER.repository.UsuarioRepository;
import API.SIGER.service.AutenticacionService;
import lombok.AllArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Locale;

@Service
@AllArgsConstructor
public class AutenticacionServiceImpl implements AutenticacionService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

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
}