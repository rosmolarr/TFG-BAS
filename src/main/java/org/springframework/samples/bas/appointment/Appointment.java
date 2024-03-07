package org.springframework.samples.bas.appointment;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.springframework.samples.bas.comunicacion.Comunicacion;
import org.springframework.samples.bas.comunicacion.EstadoComunicacion;
import org.springframework.samples.bas.entidad.Entidad;
import org.springframework.samples.bas.model.BaseEntity;
import org.springframework.samples.bas.user.User;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Getter
@Setter
@Table(name = "citas")
public class Appointment extends BaseEntity{

    @Column(name = "fecha")
    @NotNull
    private LocalDate fecha;

    @Column(name = "hora")
    @NotNull
    private LocalTime hora;

    @Column(name = "palet")
    @Min(1)
    private Integer palet;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado")
    private EstadoAppointment estado;

    @Column(name = "comentario")
    @Size(max = 255, min = 0)
    private String comentario;

    @ManyToOne
	@JoinColumn(name = "entidad_id", referencedColumnName = "id")
	private Entidad entidad;

}
