package org.springframework.samples.bas.communication;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

public interface CommunicationRepository extends CrudRepository<Communication, Integer> {

    @Query("SELECT c FROM Communication c WHERE c.entidad.user.id = :userId")
    List<Communication> findCommunicationByUserId(int userId);
}
