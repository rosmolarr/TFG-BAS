package org.springframework.samples.bas.persona;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import java.util.List;


public interface PersonaRepository extends CrudRepository<Persona, Integer> {

    @Query("SELECT p FROM Persona p WHERE p.entidad.id = :entidadId")   
    List<Persona> findByEntidad(Integer entidadId);
}
