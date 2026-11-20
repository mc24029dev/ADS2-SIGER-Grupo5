package API.SIGER.service.impl;

import API.SIGER.DTO.Auth.RegistroRequestDTO;
import API.SIGER.DTO.Auth.UsuarioResponseDTO;
import API.SIGER.DTO.Auth.UsuarioUpdateRequestDTO;
import API.SIGER.exception.AutoDesactivacionException;
import API.SIGER.exception.EmailYaRegistradoException;
import API.SIGER.exception.ReglaNegocioException;
import API.SIGER.exception.UsuarioNoEncontradoException;
import API.SIGER.persistence.entity.Administrador;
import API.SIGER.persistence.entity.Organizador;
import API.SIGER.persistence.entity.Usuario;
import API.SIGER.persistence.enums.Rol;
import API.SIGER.repository.UsuarioRepository;
import API.SIGER.service.UsuarioService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Locale;

@Slf4j
@Service
@AllArgsConstructor
public class UsuarioServiceImpl implements UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public UsuarioResponseDTO crearOrganizador(RegistroRequestDTO request, String emailAdministrador) {
        return crearCuenta(new Organizador(), request, emailAdministrador);
    }

    @Override
    @Transactional
    public UsuarioResponseDTO crearAdministrador(RegistroRequestDTO request, String emailAdministrador) {
        return crearCuenta(new Administrador(), request, emailAdministrador);
    }

    @Override
    @Transactional(readOnly = true)
    public List<UsuarioResponseDTO> listar() {
        return usuarioRepository.findAll(Sort.by("idUsuario")).stream()
                .map(UsuarioResponseDTO::desde)
                .toList();
    }

    @Override
    @Transactional
    public UsuarioResponseDTO cambiarEstado(Integer idUsuario, boolean estado, String emailAdministrador) {
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new UsuarioNoEncontradoException(idUsuario));

        if (!estado && usuario.getEmail().equalsIgnoreCase(emailAdministrador)) {
            throw new AutoDesactivacionException();
        }

        usuario.setEstado(estado);

        log.info("El administrador {} {} la cuenta {} (id {})",
                emailAdministrador, estado ? "activó" : "desactivó", usuario.getEmail(), idUsuario);

        return UsuarioResponseDTO.desde(usuario);
    }

    private UsuarioResponseDTO crearCuenta(Usuario nuevo, RegistroRequestDTO request, String emailAdministrador) {
        String email = request.email().trim().toLowerCase(Locale.ROOT);

        if (usuarioRepository.existsByEmail(email)) {
            throw new EmailYaRegistradoException();
        }

        nuevo.setNombres(request.nombres().trim());
        nuevo.setApellidos(request.apellidos().trim());
        nuevo.setEmail(email);
        nuevo.setContrasena(passwordEncoder.encode(request.contrasena()));

        try {
            usuarioRepository.save(nuevo);
        } catch (DataIntegrityViolationException e) {
            throw new EmailYaRegistradoException();
        }

        log.info("El administrador {} creó la cuenta {} con rol {}",
                emailAdministrador, email, nuevo.getRol());

        return UsuarioResponseDTO.desde(nuevo);
    }

    @Override
    @Transactional
    public UsuarioResponseDTO actualizarUsuario(Integer idUsuario, UsuarioUpdateRequestDTO request, String emailAdministrador) {
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new UsuarioNoEncontradoException(idUsuario));

        // REGLA DE NEGOCIO: Un admin no puede editar a otro admin
        if (usuario.getRol() == Rol.ADMINISTRADOR && !usuario.getEmail().equalsIgnoreCase(emailAdministrador)) {
            throw new ReglaNegocioException("No tienes permiso para editar a otro Administrador");
        }

        usuario.setNombres(request.nombres().trim());
        usuario.setApellidos(request.apellidos().trim());
        
        return UsuarioResponseDTO.desde(usuario);
    }
}