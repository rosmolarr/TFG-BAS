package org.springframework.samples.bas.comunicacion;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

public interface ComunicacionRepository extends CrudRepository<Comunicacion, Integer> {

    @Query("SELECT c FROM Comunicacion c WHERE c.entidad.user.id = :userId")
    List<Comunicacion> findComunicacionByUserId(int userId);
}
