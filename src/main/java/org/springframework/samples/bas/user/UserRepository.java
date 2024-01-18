package org.springframework.samples.bas.user;

import java.util.Optional;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.samples.bas.entidad.Entidad;

public interface UserRepository extends  CrudRepository<User, Integer>{
	
	@Query("SELECT e FROM Entidad e WHERE e.user.username = :username")
	Optional<Entidad> findEntidadByUser(String username);
	
	@Query("SELECT e FROM Entidad e WHERE e.user.id = :id")
	Optional<Entidad> findEntidadByUser(int id);

	@Query("SELECT u FROM User u WHERE u.username = :username")
	Optional<User> findByUsername(String username);

	Boolean existsByUsername(String username);
	
	@Query("SELECT u FROM User u WHERE u.authority.authority = :auth")
	Iterable<User> findAllByAuthority(String auth);

}
