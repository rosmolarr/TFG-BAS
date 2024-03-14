package org.springframework.samples.bas.entidad;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.samples.bas.auth.payload.response.MessageResponse;
import org.springframework.samples.bas.user.AuthoritiesService;
import org.springframework.samples.bas.user.User;
import org.springframework.samples.bas.user.UserService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
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
	private final AuthoritiesService authoritiesService;
	private final PasswordEncoder encoder;

	@Autowired
	public EntidadRestController(EntidadService entidadService, UserService userService, AuthoritiesService authoritiesService
			,PasswordEncoder encoder) {
		this.entidadService = entidadService;
		this.userService = userService;
		this.authoritiesService = authoritiesService;
		this.encoder = encoder;
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
	public ResponseEntity<Entidad> create(@Valid @RequestBody Entidad entidad) {
		User newUser = new User();
		newUser.setUsername(entidad.getEmail());
		newUser.setPassword(entidad.getNif()); 
		newUser.setPassword(encoder.encode(entidad.getCodigo() + entidad.getNif()));
		newUser.setAuthority(authoritiesService.findByAuthority("ENTIDAD")); 
		userService.saveUser(newUser);
		entidad.setUser(newUser);
		entidadService.saveEntidad(entidad);
		return new ResponseEntity<>(entidad, HttpStatus.CREATED);
	}

	@PostMapping(value = "/import")
	public ResponseEntity<List<Entidad>> createImportEntidades(@Valid @RequestBody List<Entidad> entidades) {
		List<Entidad> listaEntidades = new ArrayList<>();
		for(Entidad entidad: entidades){
			if (!entidadService.existsByNif(entidad.getNif())) {
				User newUser = new User();
				newUser.setUsername(entidad.getEmail());
				newUser.setPassword(entidad.getCodigo() + entidad.getNif()); 
				newUser.setPassword(encoder.encode(entidad.getNif()));
				newUser.setAuthority(authoritiesService.findByAuthority("ENTIDAD")); 
				userService.saveUser(newUser);
				entidad.setUser(newUser);
				entidadService.saveEntidad(entidad);
				listaEntidades.add(entidad);
			}
		}
		return new ResponseEntity<>(listaEntidades, HttpStatus.CREATED);
	}
	

	@PutMapping(value = "{entidadId}")
	public ResponseEntity<Entidad> update(@PathVariable("entidadId") int entidadId, @Valid @RequestBody Entidad entidad) {
		
		Entidad entidadToUpdate = entidadService.findById(entidadId);
		
		BeanUtils.copyProperties(entidad, entidadToUpdate, "id", "communications");
	
		if (entidad.getUser() != null && entidad.getUser().getId() > 0) {
			User userToUpdate = userService.findUser(entidad.getUser().getId());
			BeanUtils.copyProperties(entidad.getUser(), userToUpdate, "id");
			entidadToUpdate.setUser(userToUpdate);
		}
	
		return new ResponseEntity<>(entidadService.saveEntidad(entidadToUpdate), HttpStatus.CREATED);
	}
	

	@DeleteMapping(value = "{entidadId}")
	public ResponseEntity<MessageResponse> delete(@PathVariable("entidadId") int entidadId) {
		entidadService.deleteById(entidadId);
		return new ResponseEntity<>(new MessageResponse("La Entidad ha sido eliminada correctamente!"), HttpStatus.OK);
	}
}