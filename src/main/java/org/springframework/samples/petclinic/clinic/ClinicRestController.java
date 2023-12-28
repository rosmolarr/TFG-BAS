package org.springframework.samples.petclinic.clinic;

import java.util.List;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.samples.petclinic.auth.payload.response.MessageResponse;
import org.springframework.samples.petclinic.entidad.Entidad;
import org.springframework.samples.petclinic.entidad.EntidadService;
import org.springframework.samples.petclinic.owner.Owner;
import org.springframework.samples.petclinic.user.UserService;
import org.springframework.samples.petclinic.util.RestPreconditions;
import org.springframework.samples.petclinic.vet.Vet;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/clinics")
@Tag(name = "Clinics", description = "The Clinics managemet API")
@SecurityRequirement(name = "bearerAuth")
public class ClinicRestController {
	private final ClinicService clinicService;
	private final EntidadService entidadService;
	private final UserService userService;

	@Autowired
	public ClinicRestController(ClinicService clinicService, EntidadService entidadService,
			UserService userService) {
		this.clinicService = clinicService;
		this.entidadService = entidadService;
		this.userService = userService;
	}

	@GetMapping
	public ResponseEntity<List<Clinic>> findAllClinics(@RequestParam(required = false) Integer userId) {
		
		if (userId != null) {
			return new ResponseEntity<>(clinicService.findClinicsByUserId(userId), HttpStatus.OK);
		}

		return new ResponseEntity<>(clinicService.findAll(), HttpStatus.OK);
	}

	@GetMapping(value = "{clinicId}")
	public ResponseEntity<Clinic> findClinicById(@PathVariable("clinicId") int clinicId) {
		return new ResponseEntity<>(clinicService.findClinicById(clinicId), HttpStatus.OK);
	}

	@PostMapping
	public ResponseEntity<Clinic> createClinic(@RequestBody @Valid Clinic clinic) {

		Clinic newClinic = new Clinic();
		BeanUtils.copyProperties(clinic, newClinic, "id");
		if(clinic.getEntidad() == null){
			Entidad entidad = entidadService.findByUserId(userService.findCurrentUser().getId());
			newClinic.setEntidad(entidad);
		}


		return new ResponseEntity<>(clinicService.save(newClinic), HttpStatus.CREATED);
	}

	@PutMapping(value = "{clinicId}")
	public ResponseEntity<Clinic> updateClinic(@PathVariable("clinicId") int clinicId,
			@RequestBody @Valid Clinic clinic) {
		RestPreconditions.checkNotNull(clinicService.findClinicById(clinicId), "Clinic", "ID", clinicId);

		return new ResponseEntity<>(clinicService.update(clinic, clinicId), HttpStatus.OK);
	}

	@DeleteMapping(value = "{clinicId}")
	public ResponseEntity<MessageResponse> deleteClinic(@PathVariable("clinicId") int clinicId) {
		RestPreconditions.checkNotNull(clinicService.findClinicById(clinicId), "Clinic", "ID", clinicId);
		clinicService.delete(clinicId);
		return new ResponseEntity<>(new MessageResponse("Clinic deleted!"), HttpStatus.OK);
	}
}