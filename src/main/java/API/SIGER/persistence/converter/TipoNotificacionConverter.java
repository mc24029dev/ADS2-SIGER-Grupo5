package API.SIGER.persistence.converter;

import API.SIGER.persistence.enums.TipoNotificacion;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class TipoNotificacionConverter implements AttributeConverter<TipoNotificacion, String> {

    @Override
    public String convertToDatabaseColumn(TipoNotificacion tipo) {
        return tipo == null ? null : tipo.getValorBd();
    }

    @Override
    public TipoNotificacion convertToEntityAttribute(String valor) {
        return valor == null ? null : TipoNotificacion.desdeValorBd(valor);
    }
}
