package org.springframework.samples.bas.appointment;

public enum EstadoAppointment {
    ENVIADA("ENVIADA"),
    ACEPTADA("ACEPTADA"),
    VALIDADA("VALIDADA"),
    CANCELADA("CANCELADA");

    private final String nombre;

    EstadoAppointment(String nombre) {
        this.nombre = nombre;
    }

    public String getNombre() {
        return nombre;
    }
}
