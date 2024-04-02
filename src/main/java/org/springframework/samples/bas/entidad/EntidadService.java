package org.springframework.samples.bas.entidad;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.samples.bas.comunicacion.ComunicacionRepository;
import org.springframework.samples.bas.user.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class EntidadService {
	
    private EntidadRepository EntidadRepository;
	private ComunicacionRepository ComunicacionRepository;
	private UserRepository UserRepository;

    @Autowired
	public EntidadService(EntidadRepository EntidadRepository, ComunicacionRepository ComunicacionRepository, 
	UserRepository UserRepository
	) {
		this.EntidadRepository = EntidadRepository;
		this.ComunicacionRepository = ComunicacionRepository;
		this.UserRepository = UserRepository
		;
	}

	@Transactional(readOnly = true)
	public Iterable<Entidad> findAll() throws DataAccessException {
		return EntidadRepository
		.findAllOrder();
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
		try {
			return EntidadRepository.save(entidad);
		} catch (Exception e) {
			throw new DataAccessException("Error al guardar la entidad") {
			};
		}
	}

	@Transactional
	public void deleteById(int entidadId) throws DataAccessException {
		Integer userId = EntidadRepository.findById(entidadId).get().getUser().getId();
		ComunicacionRepository.deleteByEntidadId(entidadId);
		EntidadRepository.deleteById(entidadId);
		UserRepository.deleteById(userId);
	}

	public boolean existsByNif(String nif) {
        return EntidadRepository.existsByNif(nif);
    }
}
