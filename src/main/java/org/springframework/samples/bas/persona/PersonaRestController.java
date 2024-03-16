package org.springframework.samples.bas.persona;

import java.util.List;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.samples.bas.auth.payload.response.MessageResponse;
import org.springframework.samples.bas.comunicacion.Comunicacion;
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
@RequestMapping("/api/v1/personas")
@Tag(name = "Personas", description = "The personas managemet API")
@SecurityRequirement(name = "bearerAuth")
public class PersonaRestController {

    private final PersonaService personaService;

	@Autowired
	public PersonaRestController(PersonaService personaService) {
		this.personaService = personaService;
	}

	@GetMapping(value = "/all")
	public ResponseEntity<List<Persona>> getAll() {
		return new ResponseEntity<>((List<Persona>) personaService.findAll(), HttpStatus.OK);
	}

	@PostMapping
	public ResponseEntity<Persona> create(@Valid @RequestBody Persona persona) {
		System.out.println("---------------------------------------------------------------");
		System.out.println(persona.getEntidad());
		if(persona.getEntidad().getDescripcion().getNombre() == "CONSUMO"){
			System.err.println("No se puede crear una persona con entidad de tipo CONSUMO");
		} else {
			personaService.savePersona(persona);
		}
		return new ResponseEntity<>(persona, HttpStatus.CREATED);
	}

	@PutMapping(value = "{personaId}")
	public ResponseEntity<Persona> update(@PathVariable("personaId") int personaId, @Valid @RequestBody Persona persona) {
		
		Persona personaToUpdate = personaService.findById(personaId).get();
		
		BeanUtils.copyProperties(persona, personaToUpdate, "id", "entidad");
	
		return new ResponseEntity<>(personaService.savePersona(personaToUpdate), HttpStatus.CREATED);
	}

	@DeleteMapping(value = "{personaId}")
	public ResponseEntity<MessageResponse> delete(@PathVariable("personaId") int personaId) {
		personaService.deleteById(personaId);
		return new ResponseEntity<>(new MessageResponse("La Persona ha sido eliminada correctamente!"), HttpStatus.OK);
	}

	@GetMapping(value = "entidad/{entidadId}")
	public ResponseEntity<List<Persona>> findPersonaByEntidadId(@PathVariable("entidadId") int entidadId) {
		return new ResponseEntity<>(personaService.findByEntidadId(entidadId), HttpStatus.OK);
	}
}