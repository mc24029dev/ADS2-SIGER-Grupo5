package API.SIGER.service.impl;

import API.SIGER.DTO.OrganizadorRequestDTO;
import API.SIGER.DTO.OrganizadorResponseDTO;
import API.SIGER.persistence.entity.Organizador;
import API.SIGER.repository.OrganizadorRepository;
import API.SIGER.service.OrganizadorService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OrganizadorServiceImpl implements OrganizadorService {

    private final OrganizadorRepository organizadorRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional(readOnly = true)
    public List<OrganizadorResponseDTO> listar() {
        return organizadorRepository.findAll()
                .stream()
                .map(OrganizadorResponseDTO::desde)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public OrganizadorResponseDTO buscarPorId(Integer idOrganizador) {
        Organizador organizador = organizadorRepository.findById(idOrganizador)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Organizador no encontrado"));

        return OrganizadorResponseDTO.desde(organizador);
    }

    @Override
    @Transactional
    public OrganizadorResponseDTO registrar(OrganizadorRequestDTO request) {

        if (organizadorRepository.existsByEmail(request.email())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT, "El correo ya está registrado");
        }

        Organizador organizador = new Organizador();

        organizador.setNombres(request.nombres());
        organizador.setApellidos(request.apellidos());
        organizador.setEmail(request.email());
        organizador.setContrasena(passwordEncoder.encode(request.contrasena()));
        organizador.setEstado(true);

        return OrganizadorResponseDTO.desde(
                organizadorRepository.save(organizador));
    }

    @Override
    @Transactional
    public OrganizadorResponseDTO actualizar(
            Integer idOrganizador,
            OrganizadorRequestDTO request) {

        Organizador organizador = organizadorRepository.findById(idOrganizador)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Organizador no encontrado"));

        if (!organizador.getEmail().equals(request.email())
                && organizadorRepository.existsByEmail(request.email())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT, "El correo ya está registrado");
        }

        organizador.setNombres(request.nombres());
        organizador.setApellidos(request.apellidos());
        organizador.setEmail(request.email());
        organizador.setContrasena(passwordEncoder.encode(request.contrasena()));

        return OrganizadorResponseDTO.desde(
                organizadorRepository.save(organizador));
    }

    @Override
    @Transactional
    public void eliminar(Integer idOrganizador) {

        Organizador organizador = organizadorRepository.findById(idOrganizador)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Organizador no encontrado"));

        organizadorRepository.delete(organizador);
    }
}