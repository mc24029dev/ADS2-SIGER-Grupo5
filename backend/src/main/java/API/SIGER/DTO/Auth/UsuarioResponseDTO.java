package API.SIGER.DTO.Auth;

import API.SIGER.persistence.entity.Usuario;
import API.SIGER.persistence.enums.Rol;

public record UsuarioResponseDTO(
        Integer idUsuario,
        String nombres,
        String apellidos,
        String email,
        Rol rol,
        Boolean estado
) {
    public static UsuarioResponseDTO desde(Usuario usuario) {
        return new UsuarioResponseDTO(
                usuario.getIdUsuario(),
                usuario.getNombres(),
                usuario.getApellidos(),
                usuario.getEmail(),
                usuario.getRol(),
                usuario.getEstado());
    }
}