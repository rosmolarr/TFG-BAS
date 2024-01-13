package org.springframework.samples.bas.communication;

import org.springframework.samples.bas.entidad.Entidad;
import org.springframework.samples.bas.model.BaseEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "communications")
public class Communication extends BaseEntity{

    @Column(name = "name")
	@NotBlank
	private String name;

    @Column(name = "address")
	@NotBlank
	private String address;

    @Column(name = "telephone")
	@NotEmpty
	@Digits(fraction = 0, integer = 10)
	private String telephone;

    @ManyToOne
	@JoinColumn(name = "entidades", referencedColumnName = "id")
	private Entidad entidad;

}
