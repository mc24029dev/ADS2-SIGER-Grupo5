package API.SIGER.service.impl;

import API.SIGER.DTO.UbicacionRequestDTO;
import API.SIGER.DTO.UbicacionResponse;
import API.SIGER.persistence.entity.Ubicacion;
import API.SIGER.repository.UbicacionRepository;
import API.SIGER.service.UbicacionService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UbicacionServiceImpl implements UbicacionService {

    private final UbicacionRepository ubicacionRepository;

    @Override
    @Transactional(readOnly = true)
    public List<UbicacionResponse> listar() {
        return ubicacionRepository.findAll()
                .stream()
                .map(UbicacionResponse::desde)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public UbicacionResponse buscarPorId(Integer idUbicacion) {
        Ubicacion ubicacion = ubicacionRepository.findById(idUbicacion)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Ubicación no encontrada"
                ));

        return UbicacionResponse.desde(ubicacion);
    }

    @Override
    @Transactional
    public UbicacionResponse registrar(UbicacionRequestDTO request) {

        boolean existe = ubicacionRepository
                .existsByLugarAndSede(request.lugar(), request.sede());

        if (existe) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Ya existe una ubicación con ese lugar y sede"
            );
        }

        Ubicacion ubicacion = new Ubicacion();
        ubicacion.setLugar(request.lugar());
        ubicacion.setSede(request.sede());

        return UbicacionResponse.desde(
                ubicacionRepository.save(ubicacion)
        );
    }

    @Override
    @Transactional
    public UbicacionResponse actualizar(Integer idUbicacion, UbicacionRequestDTO request) {

        Ubicacion ubicacion = ubicacionRepository.findById(idUbicacion)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Ubicación no encontrada"
                ));

        boolean existe = ubicacionRepository
                .existsByLugarAndSedeAndIdUbicacionNot(
                        request.lugar(),
                        request.sede(),
                        idUbicacion
                );

        if (existe) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Ya existe otra ubicación con ese lugar y sede"
            );
        }

        ubicacion.setLugar(request.lugar());
        ubicacion.setSede(request.sede());

        return UbicacionResponse.desde(
                ubicacionRepository.save(ubicacion)
        );
    }

    @Override
    @Transactional
    public void eliminar(Integer idUbicacion) {

        if (!ubicacionRepository.existsById(idUbicacion)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Ubicación no encontrada"
            );
        }

        ubicacionRepository.deleteById(idUbicacion);
    }
}