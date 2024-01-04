package org.springframework.samples.petclinic.communication;

import java.util.List;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.samples.petclinic.auth.payload.response.MessageResponse;
import org.springframework.samples.petclinic.entidad.Entidad;
import org.springframework.samples.petclinic.entidad.EntidadService;
import org.springframework.samples.petclinic.user.UserService;
import org.springframework.samples.petclinic.util.RestPreconditions;
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
@RequestMapping("/api/v1/communications")
@Tag(name = "Communications", description = "The Communications managemet API")
@SecurityRequirement(name = "bearerAuth")
public class CommunicationRestController {
	private final CommunicationService communicationService;
	private final EntidadService entidadService;
	private final UserService userService;

	@Autowired
	public CommunicationRestController(CommunicationService communicationService, EntidadService entidadService,
			UserService userService) {
		this.communicationService = communicationService;
		this.entidadService = entidadService;
		this.userService = userService;
	}

	@GetMapping
	public ResponseEntity<List<Communication>> findAllCommunications(@RequestParam(required = false) Integer userId) {
		
		if (userId != null) {
			return new ResponseEntity<>(communicationService.findCommunicationsByUserId(userId), HttpStatus.OK);
		}

		return new ResponseEntity<>(communicationService.findAll(), HttpStatus.OK);
	}

	@GetMapping(value = "{communicationId}")
	public ResponseEntity<Communication> findClinicById(@PathVariable("communicationId") int communicationId) {
		return new ResponseEntity<>(communicationService.findCommunicationById(communicationId), HttpStatus.OK);
	}

	@PostMapping
	public ResponseEntity<Communication> createCommunication(@RequestBody @Valid Communication communication) {

		Communication newCommunication = new Communication();
		BeanUtils.copyProperties(communication, newCommunication, "id");
		if(communication.getEntidad() == null){
			Entidad entidad = entidadService.findByUserId(userService.findCurrentUser().getId());
			newCommunication.setEntidad(entidad);
		}


		return new ResponseEntity<>(communicationService.save(newCommunication), HttpStatus.CREATED);
	}

	@PutMapping(value = "{communicationId}")
	public ResponseEntity<Communication> updateCommunication(@PathVariable("communicationId") int communicationId,
			@RequestBody @Valid Communication communication) {
		RestPreconditions.checkNotNull(communicationService.findCommunicationById(communicationId), "Communication", "ID", communicationId);

		return new ResponseEntity<>(communicationService.update(communication, communicationId), HttpStatus.OK);
	}

	@DeleteMapping(value = "{communicationId}")
	public ResponseEntity<MessageResponse> deleteCommunication(@PathVariable("communicationId") int communicationId) {
		RestPreconditions.checkNotNull(communicationService.findCommunicationById(communicationId), "Communication", "ID", communicationId);
		communicationService.delete(communicationId);
		return new ResponseEntity<>(new MessageResponse("Communication deleted!"), HttpStatus.OK);
	}
}