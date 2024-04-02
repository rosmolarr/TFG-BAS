package org.springframework.samples.bas.entidad;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.springframework.samples.bas.comunicacion.Comunicacion;
import org.springframework.samples.bas.model.BaseEntity;
import org.springframework.samples.bas.persona.Persona;
import org.springframework.samples.bas.user.User;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Entity
@Getter
@Setter
@Table(name = "entidades")
public class Entidad extends BaseEntity{

    @OneToOne(cascade = { CascadeType.DETACH, CascadeType.REFRESH, CascadeType.PERSIST })
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private User user;

    @OneToMany(mappedBy = "entidad", orphanRemoval = true)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnore
    private Set<Comunicacion> communications;

    @OneToMany(mappedBy = "entidad", orphanRemoval = true)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnore
    private List<Persona> personasTuteladas = new ArrayList<>();

	@NotBlank(message = "El código no puede estar en blanco")
	@Pattern(regexp = "B\\d{4}", message = "El código debe seguir el patrón B seguido de cuatro dígitos")
	@Column(name = "codigo")
	private String codigo;

    @NotBlank(message = "El nombre no puede estar en blanco")
    @Column(name = "nombre")
    private String nombre;

    @NotBlank(message = "El NIF no puede estar en blanco")
    @Pattern(regexp = "^[A-HJNPQRSUVW]{1}[0-9]{7}[0-9A-J]$", message = "El CIF no es válido")
    @Size(max = 20, message = "El NIF debe tener como máximo 20 caracteres")
    @Column(name = "nif")
    private String nif;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo")
    private TipoEntidad tipo;
	
    @Enumerated(EnumType.STRING)
    @Column(name = "descripcion")
    private DescripcionEntidad descripcion;

    @NotBlank(message = "La dirección no puede estar en blanco")
    @Column(name = "direccion")
    private String direccion;

    @NotBlank(message = "La población no puede estar en blanco")
    @Column(name = "poblacion")
    private String poblacion;

    @NotBlank(message = "El código postal no puede estar en blanco")
    @Pattern(regexp = "\\d{5}", message = "El código postal debe tener 5 dígitos")
    @Column(name = "cp")
    private String cp;

    @NotBlank(message = "El email no puede estar en blanco")
    @Email(message = "Formato de email no válido")
    @Column(name = "email")
    private String email;

    @NotBlank(message = "El teléfono 1 no puede estar en blanco")
    @Pattern(regexp = "\\d{9}", message = "El teléfono 1 debe tener 9 dígitos")
    @Column(name = "telefono1")
    private String telefono1;
    
    @Pattern(regexp = "^$|\\d{9}", message = "El teléfono 2 debe tener 9 dígitos")
    @Column(name = "telefono2")
    private String telefono2;    

    @Min(value = 0, message = "El número de beneficiarios no puede ser negativo")
    @Column(name = "beneficiarios")
    private int beneficiarios;

    @Min(value = 0, message = "El valor de campo1 no puede ser negativo")
    @Column(name = "campo1")
    private int campo1;

    @Min(value = 0, message = "El valor de campo2 no puede ser negativo")
    @Column(name = "campo2")
    private int campo2;

}
