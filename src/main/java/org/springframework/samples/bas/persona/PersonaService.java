package org.springframework.samples.bas.persona;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class PersonaService {
    private PersonaRepository PersonaRepository;

    @Autowired
	public PersonaService(PersonaRepository PersonaRepository) {
		this.PersonaRepository = PersonaRepository;
	}

	@Transactional(readOnly = true)
	public Iterable<Persona> findAll() throws DataAccessException {
		return PersonaRepository.findAll();
	}

	@Transactional(readOnly = true)
	public Optional<Persona> findById(int personaId) throws DataAccessException {
		return PersonaRepository.findById(personaId);
	}

    @Transactional
	public Persona savePersona(Persona persona) throws DataAccessException {
		PersonaRepository.save(persona);
		return persona;
	}

	@Transactional
	public void deleteById(int personaId) throws DataAccessException {
		PersonaRepository.deleteById(personaId);
	}

	@Transactional
	public List<Persona> findByEntidadId(int entidadId) throws DataAccessException {
		return PersonaRepository.findByEntidad(entidadId);
	}
}
