package org.springframework.samples.petclinic.auth;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.Collection;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.samples.petclinic.auth.payload.request.SignupRequest;
import org.springframework.samples.petclinic.communication.Communication;
import org.springframework.samples.petclinic.communication.CommunicationService;
import org.springframework.samples.petclinic.entidad.Entidad;
import org.springframework.samples.petclinic.entidad.EntidadService;
import org.springframework.samples.petclinic.user.AuthoritiesService;
import org.springframework.samples.petclinic.user.User;
import org.springframework.samples.petclinic.user.UserService;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
public class AuthServiceTests {

	@Autowired
	protected AuthService authService;
	@Autowired
	protected UserService userService;
	@Autowired
	protected CommunicationService clinicService;
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
		request.setAddress("prueba");
		request.setAuthority(auth);
		request.setCity("prueba");
		request.setFirstName("prueba");
		request.setLastName("prueba");
		request.setPassword("prueba");
		request.setTelephone("123123123");
		request.setUsername(username);

		if(auth == "ENTIDAD") {
			User entidadUser = new User();
			entidadUser.setUsername("entidadTest");
			entidadUser.setPassword("entidadTest");
			entidadUser.setAuthority(authoritiesService.findByAuthority("ENTIDAD"));
			userService.saveUser(entidadUser);
			Entidad entidad = new Entidad();
			Communication communication = new Communication();
			entidad.setFirstName("Test Name");
			entidad.setLastName("Test Surname");
			entidad.setUser(entidadUser);
			entidadService.saveEntidad(entidad);
			communication.setName("Clinic Test");
			communication.setAddress("Test Address");
			communication.setTelephone("123456789");
			communication.setEntidad(entidad);
			clinicService.save(communication);
			request.setCommunication(communication);
		}

		return request;
	}

}
