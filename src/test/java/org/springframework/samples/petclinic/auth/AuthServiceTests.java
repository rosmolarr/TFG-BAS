package org.springframework.samples.petclinic.auth;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.Collection;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.samples.petclinic.auth.payload.request.SignupRequest;
import org.springframework.samples.petclinic.clinic.Clinic;
import org.springframework.samples.petclinic.clinic.ClinicService;
import org.springframework.samples.petclinic.clinic.PricingPlan;
import org.springframework.samples.petclinic.entidad.Entidad;
import org.springframework.samples.petclinic.entidad.EntidadService;
import org.springframework.samples.petclinic.owner.Owner;
import org.springframework.samples.petclinic.owner.OwnerService;
import org.springframework.samples.petclinic.user.AuthoritiesService;
import org.springframework.samples.petclinic.user.User;
import org.springframework.samples.petclinic.user.UserService;
import org.springframework.samples.petclinic.vet.Vet;
import org.springframework.samples.petclinic.vet.VetService;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
public class AuthServiceTests {

	@Autowired
	protected AuthService authService;
	@Autowired
	protected UserService userService;
	@Autowired
	protected VetService vetService;
	@Autowired
	protected OwnerService ownerService;
	@Autowired
	protected ClinicService clinicService;
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
	
	@Test
	@Transactional
	public void shouldCreateVetUser() {
		SignupRequest request = createRequest("VET", "vettest");
		int userFirstCount = ((Collection<User>) this.userService.findAll()).size();
		int vetFirstCount = ((Collection<Vet>) this.vetService.findAll()).size();
		this.authService.createUser(request);
		int userLastCount = ((Collection<User>) this.userService.findAll()).size();
		int vetLastCount = ((Collection<Vet>) this.vetService.findAll()).size();
		assertEquals(userFirstCount + 1, userLastCount);
		assertEquals(vetFirstCount + 1, vetLastCount);
	}
	
	@Test
	@Transactional
	public void shouldCreateOwnerUser() {
		SignupRequest request = createRequest("OWNER", "ownertest");
		int userFirstCount = ((Collection<User>) this.userService.findAll()).size();
		int ownerFirstCount = ((Collection<Owner>) this.ownerService.findAll()).size();
		this.authService.createUser(request);
		int userLastCount = ((Collection<User>) this.userService.findAll()).size();
		int ownerLastCount = ((Collection<Owner>) this.ownerService.findAll()).size();
		assertEquals(userFirstCount + 1, userLastCount);
		assertEquals(ownerFirstCount + 1, ownerLastCount);
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

		if(auth == "OWNER" || auth == "VET") {
			User entidadUser = new User();
			entidadUser.setUsername("entidadTest");
			entidadUser.setPassword("entidadTest");
			entidadUser.setAuthority(authoritiesService.findByAuthority("CLINIC_OWNER"));
			userService.saveUser(entidadUser);
			Entidad entidad = new Entidad();
			Clinic clinic = new Clinic();
			entidad.setFirstName("Test Name");
			entidad.setLastName("Test Surname");
			entidad.setUser(entidadUser);
			entidadService.saveEntidad(entidad);
			clinic.setName("Clinic Test");
			clinic.setAddress("Test Address");
			clinic.setPlan(PricingPlan.PLATINUM);
			clinic.setTelephone("123456789");
			clinic.setEntidad(entidad);
			clinicService.save(clinic);
			request.setClinic(clinic);
		}

		return request;
	}

}
