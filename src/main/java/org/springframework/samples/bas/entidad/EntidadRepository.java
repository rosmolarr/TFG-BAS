package org.springframework.samples.bas.entidad;

import java.util.Optional;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

public interface EntidadRepository extends CrudRepository<Entidad, Integer> {

    @Query("SELECT entidad FROM Entidad entidad WHERE entidad.user.id = :userId")
    Optional<Entidad> findByUserId(int userId);

    @Query("SELECT CASE WHEN COUNT(entidad) > 0 THEN true ELSE false END FROM Entidad entidad WHERE entidad.nif = :nif")
    boolean existsByNif(String nif);

    @Query("SELECT e FROM Entidad e ORDER BY e.nombre")
    Iterable<Entidad> findAllOrder();
}
