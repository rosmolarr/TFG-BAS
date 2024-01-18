package org.springframework.samples.petclinic.auth;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.Collection;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.samples.bas.auth.AuthService;
import org.springframework.samples.bas.auth.payload.request.SignupRequest;
import org.springframework.samples.bas.entidad.Entidad;
import org.springframework.samples.bas.entidad.EntidadService;
import org.springframework.samples.bas.user.AuthoritiesService;
import org.springframework.samples.bas.user.User;
import org.springframework.samples.bas.user.UserService;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
public class AuthServiceTests {

	@Autowired
	protected AuthService authService;
	@Autowired
	protected UserService userService;
	@Autowired
	protected EntidadService entidadService;
	@Autowired
	protected AuthoritiesService authoritiesService;

	@Test
	@Transactional
	public void shouldCreateAdminUser() {
		SignupRequest request = createRequest("ADMIN", "admin2");
		int userFirstCount = ((Collection<User>) this.userService.findAll()).size();
		this.authService.createUser(request);
		int userLastCount = ((Collection<User>) this.userService.findAll()).size();
		assertEquals(userFirstCount + 1, userLastCount);
	}

	private SignupRequest createRequest(String auth, String username) {
		SignupRequest request = new SignupRequest();
		request.setAuthority(auth);
		request.setPassword("prueba");
		request.setUsername(username);

		if(auth == "ENTIDAD") {
			User entidadUser = new User();
			entidadUser.setUsername("entidadTest");
			entidadUser.setPassword("entidadTest");
			entidadUser.setAuthority(authoritiesService.findByAuthority("ENTIDAD"));
			userService.saveUser(entidadUser);
			Entidad entidad = new Entidad();
			entidad.setUser(entidadUser);
			entidadService.saveEntidad(entidad);
		}

		return request;
	}

}
