package org.springframework.samples.petclinic.auth.payload.request;

import org.springframework.samples.petclinic.communication.Communication;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SignupRequest {
	
	// User
	@NotBlank
	private String username;
	
	@NotBlank
	private String authority;

	@NotBlank
	private String password;
	
	//Both
	@NotBlank
	private String firstName;
	
	@NotBlank
	private String lastName;
	
	@NotBlank
	private String city;
	//Entidad

	private String address;
	private String telephone;
	private Communication communication;

}
