package org.springframework.samples.bas.entidad;

public enum TipoEntidad {
    COMUNIDAD_RELIGIOSA("COMUNIDAD RELIGIOSA"),
    CENTROS_DE_INSERCION("CENTROS DE INSERCIÓN"),
    CASAS_DE_AGOGIDAS("CASAS DE AGOGIDAS"),
    COMEDOR_SOCIAL("COMEDOR SOCIAL"),
    PARROQUIA("PARROQUIA"),
    CENTRO_ASISTENCIAL("CENTRO ASISTENCIAL"),
    GUARDERIA("GUARDERÍA"),
    APOYO_ADICCIONES("APOYO ADICCIONES"),
    APOYO_A_MENORES_Y_ADOLESCENTES("APOYO A MENORES Y ADOLESCENTES");

    private final String nombre;

    TipoEntidad(String nombre) {
        this.nombre = nombre;
    }

    public String getNombre() {
        return nombre;
    }
}

