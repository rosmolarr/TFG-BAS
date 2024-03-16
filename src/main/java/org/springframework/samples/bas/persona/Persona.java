package org.springframework.samples.bas.persona;

import org.springframework.samples.bas.entidad.Entidad;
import org.springframework.samples.bas.model.BaseEntity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "personas")
public class Persona extends BaseEntity{

    @Column(name = "nombre", nullable = false)
    private String nombre;

    @Column(name = "apellidos", nullable = false)
    private String apellidos;

    @Column(name = "edad", nullable = false)
    private int edad;

    @Column(name = "otros")
    private String otros;

    // Relación many-to-one con la entidad
    @ManyToOne
    @JoinColumn(name = "entidad_id", referencedColumnName = "id")
    private Entidad entidad;

}
