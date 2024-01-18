package org.springframework.samples.bas.auth;

import java.util.ArrayList;

import jakarta.transaction.Transactional;
import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.samples.bas.auth.payload.request.SignupRequest;
import org.springframework.samples.bas.entidad.Entidad;
import org.springframework.samples.bas.entidad.EntidadService;
import org.springframework.samples.bas.user.Authorities;
import org.springframework.samples.bas.user.AuthoritiesService;
import org.springframework.samples.bas.user.User;
import org.springframework.samples.bas.user.UserService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

	private final PasswordEncoder encoder;
	private final AuthoritiesService authoritiesService;
	private final UserService userService;
	private final EntidadService entidadService;

	@Autowired
	public AuthService(PasswordEncoder encoder, AuthoritiesService authoritiesService, UserService userService,
			EntidadService entidadService) {
		this.encoder = encoder;
		this.authoritiesService = authoritiesService;
		this.userService = userService;
		this.entidadService = entidadService;
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
			entidad.setUser(user);
			entidadService.saveEntidad(entidad);
			break;
		}
	}

}
