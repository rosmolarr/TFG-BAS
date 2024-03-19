package org.springframework.samples.bas.comunicacion;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

public interface ComunicacionRepository extends CrudRepository<Comunicacion, Integer> {

    @Query("SELECT c FROM Comunicacion c WHERE c.entidad.id = :entidadId ORDER BY c.fecha DESC")
    List<Comunicacion> findComunicacionByEntidadId(int entidadId);

    @Query("SELECT c FROM Comunicacion c ORDER BY c.fecha DESC")
    List<Comunicacion> findComunicacionForDashboard();

    @Query("DELETE FROM Comunicacion c WHERE c.entidad.id = :entidadId")
    void deleteByEntidadId(int entidadId);

    @Query("SELECT c FROM Comunicacion c ORDER BY c.id DESC LIMIT :n")
    List<Comunicacion> findFirstNComunicacionesOrderedByIdDesc(int n);
}
