package org.springframework.samples.petclinic.user;

import java.util.Optional;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.samples.petclinic.entidad.Entidad;

public interface UserRepository extends  CrudRepository<User, String>{
	
	@Query("SELECT e FROM Entidad e WHERE e.user.username = :username")
	Optional<Entidad> findEntidadByUser(String username);
	
	@Query("SELECT e FROM Entidad e WHERE e.user.id = :id")
	Optional<Entidad> findEntidadByUser(int id);

	Optional<User> findByUsername(String username);

	Boolean existsByUsername(String username);

	Optional<User> findById(Integer id);
	
	@Query("SELECT u FROM User u WHERE u.authority.authority = :auth")
	Iterable<User> findAllByAuthority(String auth);

}
