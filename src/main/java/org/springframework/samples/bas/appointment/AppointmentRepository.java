package org.springframework.samples.bas.appointment;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

public interface AppointmentRepository extends CrudRepository<Appointment, Integer> {

    @Query("SELECT a FROM Appointment a ORDER BY a.fecha, a.hora")
    List<Appointment> findAllOrderByDate();

    @Query("SELECT a FROM Appointment a WHERE a.entidad.id = :entidadId")
    List<Appointment> findAppointmentByEntidadId(int entidadId);

}
