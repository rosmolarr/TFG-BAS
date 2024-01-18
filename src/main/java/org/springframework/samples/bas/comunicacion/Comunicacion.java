package org.springframework.samples.bas.comunicacion;

import java.time.LocalDate;

import org.springframework.samples.bas.entidad.Entidad;
import org.springframework.samples.bas.entidad.TipoEntidad;
import org.springframework.samples.bas.model.BaseEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "comunicaciones")
public class Comunicacion extends BaseEntity{

    /*
     * Formato fecha: yyyy/mm/dd
     */

    @NotBlank(message = "La fecha no puede estar en blanco")
    @Column(name = "fecha")
    private LocalDate fecha;

    @NotBlank(message = "El título no puede estar en blanco")
	@Column(name = "titulo")
    private String titulo;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado")
    private EstadoComunicacion estado;

    @NotBlank(message = "La descripción no puede estar en blanco")
	@Column(name = "descripcion")
    private String descripcion;

	@Column(name = "respuesta")
    private String respuesta;

    @ManyToOne
	@JoinColumn(name = "entidad_id", referencedColumnName = "id")
	private Entidad entidad;

}
