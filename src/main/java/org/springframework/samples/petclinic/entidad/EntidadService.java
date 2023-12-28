package org.springframework.samples.petclinic.entidad;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class EntidadService {
    private EntidadRepository EntidadRepository;

    @Autowired
	public EntidadService(EntidadRepository EntidadRepository
	) {
		this.EntidadRepository = EntidadRepository
		;
	}

	@Transactional(readOnly = true)
	public Iterable<Entidad> findAll() throws DataAccessException {
		return EntidadRepository
		.findAll();
	}

	@Transactional(readOnly = true)
	public Entidad findById(int entidadId) throws DataAccessException {
		return EntidadRepository
		.findById(entidadId).get();
	}

	@Transactional(readOnly = true)
	public Entidad findByUserId(int userId) throws DataAccessException {
		
		Optional<Entidad> entidad = EntidadRepository
		.findByUserId(userId);
		
		if(entidad.isPresent()) {
			return entidad.get();
		}else{
			return null;
		}
	}

    @Transactional
	public Entidad saveEntidad(Entidad entidad) throws DataAccessException {
		EntidadRepository
		.save(entidad);
		return entidad;
	}

	@Transactional
	public void deleteById(int entidadId) throws DataAccessException {
		EntidadRepository
		.deleteById(entidadId);
	}
}
