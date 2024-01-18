package org.springframework.samples.bas.entidad;

import java.util.List;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.samples.bas.auth.payload.response.MessageResponse;
import org.springframework.samples.bas.user.User;
import org.springframework.samples.bas.user.UserService;
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
@RequestMapping("/api/v1/entidades")
@Tag(name = "Entidades", description = "The Entidades managemet API")
@SecurityRequirement(name = "bearerAuth")
public class EntidadRestController {
    private final EntidadService entidadService;
	private final UserService userService;

	@Autowired
	public EntidadRestController(EntidadService entidadService, UserService userService) {
		this.entidadService = entidadService;
		this.userService = userService;
	}

	@GetMapping(value = "/all")
	public ResponseEntity<List<Entidad>> getAll() {
		return new ResponseEntity<>((List<Entidad>) entidadService.findAll(), HttpStatus.OK);
	}

	@GetMapping(value = "{entidadId}")
	public ResponseEntity<Entidad> getEntidadById(@PathVariable("entidadId") int entidadId) {
		return new ResponseEntity<>(entidadService.findById(entidadId), HttpStatus.OK);
	}

	@PostMapping
	public ResponseEntity<Entidad> create(@Valid @RequestBody Entidad entidad, @RequestParam(required = false) int userId) {
		
		System.out.println("ID: " + userId);

		User user = userService.findUser(userId);
		entidad.setUser(user);
		
		entidadService.saveEntidad(entidad);
		return new ResponseEntity<>(entidad, HttpStatus.CREATED);
	}

	@PutMapping(value = "{entidadId}")
	public ResponseEntity<Entidad> create(@PathVariable("entidadId") int entidadId, @Valid @RequestBody Entidad entidad) {
		
		Entidad entidadToUpdate= entidadService.findById(entidadId);
		BeanUtils.copyProperties(entidad, entidadToUpdate, "id", "user", "clinics");
	
		return new ResponseEntity<>(entidadService.saveEntidad(entidadToUpdate), HttpStatus.CREATED);
	}

	@DeleteMapping(value = "{entidadId}")
	public ResponseEntity<MessageResponse> delete(@PathVariable("entidadId") int entidadId) {
		entidadService.deleteById(entidadId);
		return new ResponseEntity<>(new MessageResponse("La Entidad ha sido eliminada correctamente!"), HttpStatus.OK);
	}
}