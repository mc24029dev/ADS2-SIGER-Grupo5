package API.SIGER.service.impl;

import API.SIGER.DTO.Ubicacion.UbicacionRequestDTO;
import API.SIGER.DTO.Ubicacion.UbicacionResponseDTO;
import API.SIGER.exception.RecursoNoEncontradoException;
import API.SIGER.exception.ReglaNegocioException;
import API.SIGER.persistence.entity.Ubicacion;
import API.SIGER.repository.EventoRepository;
import API.SIGER.repository.UbicacionRepository;
import API.SIGER.service.UbicacionService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UbicacionServiceImpl implements UbicacionService {

    private final UbicacionRepository ubicacionRepository;
    private final EventoRepository eventoRepository;

    @Override
    @Transactional(readOnly = true)
    public List<UbicacionResponseDTO> listar() {
        return ubicacionRepository.findAll(Sort.by("sede", "lugar")).stream()
                .map(UbicacionResponseDTO::desde)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public UbicacionResponseDTO buscarPorId(Integer idUbicacion) {
        return UbicacionResponseDTO.desde(obtener(idUbicacion));
    }

    @Override
    @Transactional
    public UbicacionResponseDTO crear(UbicacionRequestDTO request) {
        String lugar = request.lugar().trim();
        String sede = request.sede().trim();

        if (ubicacionRepository.existsByLugarIgnoreCaseAndSedeIgnoreCase(lugar, sede)) {
            throw new ReglaNegocioException("Ya existe una ubicación con ese lugar y sede");
        }

        Ubicacion ubicacion = new Ubicacion();
        ubicacion.setLugar(lugar);
        ubicacion.setSede(sede);
        return UbicacionResponseDTO.desde(ubicacionRepository.save(ubicacion));
    }

    @Override
    @Transactional
    public UbicacionResponseDTO actualizar(Integer idUbicacion, UbicacionRequestDTO request) {
        Ubicacion ubicacion = obtener(idUbicacion);
        String lugar = request.lugar().trim();
        String sede = request.sede().trim();

        if (ubicacionRepository.existsByLugarIgnoreCaseAndSedeIgnoreCaseAndIdUbicacionNot(
                lugar, sede, idUbicacion)) {
            throw new ReglaNegocioException("Ya existe otra ubicación con ese lugar y sede");
        }

        ubicacion.setLugar(lugar);
        ubicacion.setSede(sede);
        return UbicacionResponseDTO.desde(ubicacion);
    }

    @Override
    @Transactional
    public void eliminar(Integer idUbicacion) {
        Ubicacion ubicacion = obtener(idUbicacion);

        if (eventoRepository.existsByUbicacion_IdUbicacion(idUbicacion)) {
            throw new ReglaNegocioException(
                    "No se puede eliminar la ubicación porque tiene eventos asociados");
        }
        ubicacionRepository.delete(ubicacion);
    }

    private Ubicacion obtener(Integer idUbicacion) {
        return ubicacionRepository.findById(idUbicacion)
                .orElseThrow(() -> new RecursoNoEncontradoException("La ubicación no existe"));
    }
}
