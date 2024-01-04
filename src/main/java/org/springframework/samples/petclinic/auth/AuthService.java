package org.springframework.samples.petclinic.auth;

import java.util.ArrayList;

import jakarta.transaction.Transactional;
import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.samples.petclinic.auth.payload.request.SignupRequest;
import org.springframework.samples.petclinic.communication.CommunicationService;
import org.springframework.samples.petclinic.entidad.Entidad;
import org.springframework.samples.petclinic.entidad.EntidadService;
import org.springframework.samples.petclinic.user.Authorities;
import org.springframework.samples.petclinic.user.AuthoritiesService;
import org.springframework.samples.petclinic.user.User;
import org.springframework.samples.petclinic.user.UserService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

	private final PasswordEncoder encoder;
	private final AuthoritiesService authoritiesService;
	private final UserService userService;
	private final EntidadService entidadService;
	private final CommunicationService clinicService;

	@Autowired
	public AuthService(PasswordEncoder encoder, AuthoritiesService authoritiesService, UserService userService,
			EntidadService entidadService, CommunicationService clinicService) {
		this.encoder = encoder;
		this.authoritiesService = authoritiesService;
		this.userService = userService;
		this.entidadService = entidadService;
		this.clinicService = clinicService;
	}

	@Transactional
	public void createUser(@Valid SignupRequest request) {
		User user = new User();
		user.setUsername(request.getUsername());
		user.setPassword(encoder.encode(request.getPassword()));
		String strRoles = request.getAuthority();
		Authorities role;

		switch (strRoles.toLowerCase()) {
		case "admin":
			role = authoritiesService.findByAuthority("ADMIN");
			user.setAuthority(role);
			userService.saveUser(user);
			break;
		case "entidades": //default: ??
			role = authoritiesService.findByAuthority("ENTIDAD");
			user.setAuthority(role);
			userService.saveUser(user);
			Entidad entidad = new Entidad();
			entidad.setFirstName(request.getFirstName());
			entidad.setLastName(request.getLastName());
			entidad.setUser(user);
			entidadService.saveEntidad(entidad);
			break;
		}
	}

}
