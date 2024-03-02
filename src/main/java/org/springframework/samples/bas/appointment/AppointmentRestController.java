package org.springframework.samples.bas.appointment;

import java.util.List;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.samples.bas.auth.payload.response.MessageResponse;
import org.springframework.samples.bas.entidad.EntidadService;
import org.springframework.samples.bas.util.RestPreconditions;
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
@RequestMapping("/api/v1/citas")
@Tag(name = "Citas", description = "The Appointment managemet API")
@SecurityRequirement(name = "bearerAuth")
public class AppointmentRestController {

	private final AppointmentService appointmentService;

	@Autowired
	public AppointmentRestController(AppointmentService appointmentService) {
		this.appointmentService = appointmentService;
	}

	@GetMapping
	public ResponseEntity<List<Appointment>> findAllAppointment() {
		return new ResponseEntity<>(appointmentService.findAll(), HttpStatus.OK);
	}

	@GetMapping(value = "{appointmentId}")
	public ResponseEntity<Appointment> findAppointmentById(@PathVariable("appointmentId") int appointmentId) {
		return new ResponseEntity<>(appointmentService.findAppointmentById(appointmentId), HttpStatus.OK);
	}

	@PostMapping
	public ResponseEntity<Appointment> createAppointment(@RequestBody @Valid Appointment appointment) {
		Appointment newAppointment= new Appointment();
		BeanUtils.copyProperties(appointment, newAppointment, "id");
		return new ResponseEntity<>(appointmentService.save(newAppointment), HttpStatus.CREATED);
	}

	@PutMapping(value = "{appointmentId}")
	public ResponseEntity<Appointment> updateAppointment(@PathVariable("appointmentId") int appointmentId,
			@RequestBody @Valid Appointment appointment) {
		RestPreconditions.checkNotNull(appointmentService.findAppointmentById(appointmentId), "Appointment", "ID", appointmentId);

		return new ResponseEntity<>(appointmentService.update(appointment, appointmentId), HttpStatus.OK);
	}

	@DeleteMapping(value = "{appointmentId}")
	public ResponseEntity<MessageResponse> deleteAppointment(@PathVariable("appointmentId") int appointmentId) {
		RestPreconditions.checkNotNull(appointmentService.findAppointmentById(appointmentId), "Appointment", "ID", appointmentId);
		appointmentService.delete(appointmentId);
		return new ResponseEntity<>(new MessageResponse("Comunicación borrada!"), HttpStatus.OK);
	}

}