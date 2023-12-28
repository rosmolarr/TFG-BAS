package org.springframework.samples.petclinic.entidad;

import java.util.Optional;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

public interface EntidadRepository extends CrudRepository<Entidad, Integer> {

    @Query("SELECT entidad FROM Entidad entidad WHERE entidad.user.id = :userId")
    Optional<Entidad> findByUserId(int userId);

}
