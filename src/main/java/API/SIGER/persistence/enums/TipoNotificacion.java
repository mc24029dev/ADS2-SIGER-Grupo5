package API.SIGER.persistence.enums;

/**
 * La BD guarda 'Confirmación', 'Recordatorio' y 'Cancelación' (con tilde).
 * En Java usamos nombres sin tilde y TipoNotificacionConverter traduce
 * entre ambos al guardar y al leer.
 */
public enum TipoNotificacion {
    CONFIRMACION("Confirmación"),
    RECORDATORIO("Recordatorio"),
    CANCELACION("Cancelación");

    private final String valorBd;

    TipoNotificacion(String valorBd) {
        this.valorBd = valorBd;
    }

    public String getValorBd() {
        return valorBd;
    }

    public static TipoNotificacion desdeValorBd(String valor) {
        for (TipoNotificacion tipo : values()) {
            if (tipo.valorBd.equals(valor)) {
                return tipo;
            }
        }
        throw new IllegalArgumentException("Tipo de notificación desconocido: " + valor);
    }
}
