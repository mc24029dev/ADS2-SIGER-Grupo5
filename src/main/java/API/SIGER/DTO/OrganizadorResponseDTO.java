package API.SIGER.DTO;

import API.SIGER.persistence.entity.Organizador;

public record OrganizadorResponseDTO(
        Integer idUsuario,
        String nombres,
        String apellidos,
        String email,
        Boolean estado
) {

    public static OrganizadorResponseDTO desde(Organizador organizador) {
        return new OrganizadorResponseDTO(
                organizador.getIdUsuario(),
                organizador.getNombres(),
                organizador.getApellidos(),
                organizador.getEmail(),
                organizador.getEstado()
        );
    }
}