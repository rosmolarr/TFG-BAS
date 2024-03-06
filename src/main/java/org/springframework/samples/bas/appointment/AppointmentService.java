package org.springframework.samples.bas.appointment;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.samples.bas.comunicacion.Comunicacion;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AppointmentService {
    
    private AppointmentRepository appointmentRepository;

    @Autowired
	public AppointmentService(AppointmentRepository appointmentRepository) {
		this.appointmentRepository = appointmentRepository;
	}

	@Transactional(readOnly = true)
	public List<Appointment> findAll() throws DataAccessException {
		
		return (List<Appointment>) appointmentRepository.findAllOrderByDate();
	}

	@Transactional(readOnly = true)
	public Appointment findAppointmentById(int appointmentId) throws DataAccessException {
		
		Optional<Appointment> appointment = appointmentRepository.findById(appointmentId);
		
		if(appointment.isPresent()) {
			return appointment.get();
		}else{
			return null;
		}
	}

    @Transactional
	public Appointment save(Appointment appointment) throws DataAccessException {
		appointmentRepository.save(appointment);
		return appointment;
	}

	@Transactional
	public Appointment update(Appointment appointment, int appointmentId) throws DataAccessException {
		
		Appointment appointmentToUpdate = appointmentRepository.findById(appointmentId).get();
		if (appointment.getEntidad() != null){
			BeanUtils.copyProperties(appointment, appointmentToUpdate, "id");
		}else{
			BeanUtils.copyProperties(appointment, appointmentToUpdate, "id", "entidad");
		}

		return save(appointmentToUpdate);
	}

	@Transactional
	public void delete(int appointmentId) throws DataAccessException {
		appointmentRepository.deleteById(appointmentId);
	}

		@Transactional
	public List<Appointment> findAppointmentByEntidadId(int entidadId) throws DataAccessException {
		return appointmentRepository.findAppointmentByEntidadId(entidadId);
	}
}
