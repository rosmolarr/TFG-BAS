package org.springframework.samples.bas.entidad;

public enum DescripcionEntidad {
    CONSUMO("CONSUMO"),
    REPARTO("REPARTO");

    private final String nombre;

    DescripcionEntidad(String nombre) {
        this.nombre = nombre;
    }

    public String getNombre() {
        return nombre;
    }
}
