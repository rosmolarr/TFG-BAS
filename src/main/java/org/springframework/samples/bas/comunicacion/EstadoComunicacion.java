package org.springframework.samples.bas.comunicacion;

public enum EstadoComunicacion {
    RESPONDIDA("RESPONDIDA"),
    PENDIENTE("PENDIENTE"),
    LLAMAR("FALTA LLAMAR"),
    REUNION("FALTA REUNION");

    private final String nombre;

    EstadoComunicacion(String nombre) {
        this.nombre = nombre;
    }

    public String getNombre() {
        return nombre;
    }
}
