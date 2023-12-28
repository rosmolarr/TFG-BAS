package org.springframework.samples.petclinic.clinic;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.samples.petclinic.owner.Owner;
import org.springframework.samples.petclinic.vet.Vet;

public interface ClinicRepository extends CrudRepository<Clinic, Integer> {

    @Query("SELECT c FROM Clinic c WHERE c.entidad.user.id = :userId")
    List<Clinic> findClinicsByUserId(int userId);
}
