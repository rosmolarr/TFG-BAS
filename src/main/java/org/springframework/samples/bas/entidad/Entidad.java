package org.springframework.samples.bas.entidad;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.springframework.samples.bas.communication.Communication;
import org.springframework.samples.bas.model.Person;
import org.springframework.samples.bas.user.User;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Set;

@Entity
@Getter
@Setter
@Table(name = "entidades")
public class Entidad extends Person{

    @OneToOne(cascade = { CascadeType.DETACH, CascadeType.REFRESH, CascadeType.PERSIST })
	@JoinColumn(name = "user_id", referencedColumnName = "id")
	@OnDelete(action = OnDeleteAction.CASCADE)
	private User user;

    @OneToMany(mappedBy = "entidad", orphanRemoval = true)
	@OnDelete(action = OnDeleteAction.CASCADE)
	@JsonIgnore
	private Set<Communication> communications;
}
