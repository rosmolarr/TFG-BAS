package org.springframework.samples.bas.comunicacion;

import java.util.List;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.samples.bas.auth.payload.response.MessageResponse;
import org.springframework.samples.bas.entidad.Entidad;
import org.springframework.samples.bas.entidad.EntidadService;
import org.springframework.samples.bas.user.UserService;
import org.springframework.samples.bas.util.RestPreconditions;
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
@RequestMapping("/api/v1/comunicaciones")
@Tag(name = "Comunicaciones", description = "The Comunicaciones managemet API")
@SecurityRequirement(name = "bearerAuth")
public class ComunicacionRestController {
	private final ComunicacionService comunicacionService;
	private final EntidadService entidadService;
	private final UserService userService;

	@Autowired
	public ComunicacionRestController(ComunicacionService comunicacionService, EntidadService entidadService,
			UserService userService) {
		this.comunicacionService = comunicacionService;
		this.entidadService = entidadService;
		this.userService = userService;
	}

	@GetMapping
	public ResponseEntity<List<Comunicacion>> findAllComunicaciones() {
		return new ResponseEntity<>(comunicacionService.findAll(), HttpStatus.OK);
	}

	@GetMapping(value = "{comunicacionId}")
	public ResponseEntity<Comunicacion> findComunicacionById(@PathVariable("comunicacionId") int comunicacionId) {
		return new ResponseEntity<>(comunicacionService.findComunicacionById(comunicacionId), HttpStatus.OK);
	}

	@GetMapping(value = "entidad/{entidadId}")
	public ResponseEntity<List<Comunicacion>> findComunicacionByEntidadId(@PathVariable("entidadId") int entidadId) {
		return new ResponseEntity<>(comunicacionService.findComunicacionByEntidadId(entidadId), HttpStatus.OK);
	}

	@PostMapping
	public ResponseEntity<Comunicacion> createCommunication(@RequestBody @Valid Comunicacion communication) {

		Comunicacion newCommunication = new Comunicacion();
		BeanUtils.copyProperties(communication, newCommunication, "id");
		if(communication.getEntidad() == null){
			Entidad entidad = entidadService.findByUserId(userService.findCurrentUser().getId());
			newCommunication.setEntidad(entidad);
		}


		return new ResponseEntity<>(comunicacionService.save(newCommunication), HttpStatus.CREATED);
	}

	@PutMapping(value = "{comunicacionId}")
	public ResponseEntity<Comunicacion> updateCommunication(@PathVariable("comunicacionId") int comunicacionId,
			@RequestBody @Valid Comunicacion communication) {
		RestPreconditions.checkNotNull(comunicacionService.findComunicacionById(comunicacionId), "Communication", "ID", comunicacionId);

		return new ResponseEntity<>(comunicacionService.update(communication, comunicacionId), HttpStatus.OK);
	}

	@DeleteMapping(value = "{comunicacionId}")
	public ResponseEntity<MessageResponse> deleteCommunication(@PathVariable("comunicacionId") int comunicacionId) {
		RestPreconditions.checkNotNull(comunicacionService.findComunicacionById(comunicacionId), "Communication", "ID", comunicacionId);
		comunicacionService.delete(comunicacionId);
		return new ResponseEntity<>(new MessageResponse("Comunicación borrada!"), HttpStatus.OK);
	}
}